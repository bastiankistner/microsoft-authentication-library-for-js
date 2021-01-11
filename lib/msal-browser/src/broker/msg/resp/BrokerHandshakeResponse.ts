/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { BrokerMessage } from "../BrokerMessage";
import { BrokerMessageType } from "../../../utils/BrowserConstants";
import { BrowserAuthError } from "../../../error/BrowserAuthError";

/**
 * Message type for responses to BrokerHandshakeRequests
 */
export class BrokerHandshakeResponse extends BrokerMessage {
    public version: string;
    public readonly brokerOrigin: string;

    constructor(version: string, brokerOrigin: string) {
        super(BrokerMessageType.HANDSHAKE_RESPONSE);

        this.version = version;
        this.brokerOrigin = brokerOrigin;
    }

    /**
     * Validate broker handshake
     * @param message 
     * @param trustedBrokerDomains 
     */
    static validate(message: MessageEvent, trustedBrokerDomains?: string[]): BrokerHandshakeResponse|null {
        // First, validate message type
        const validMessage = BrokerMessage.validateMessage(message);
        if (trustedBrokerDomains &&
            validMessage && 
            validMessage.data.messageType === BrokerMessageType.HANDSHAKE_RESPONSE &&
            validMessage.data.version) {
            // TODO, verify version compatibility
            if (trustedBrokerDomains.indexOf(validMessage.origin) < 0) {
                // TODO make this a browser Error
                throw BrowserAuthError.createUntrustedBrokerError();
            }

            return new BrokerHandshakeResponse(validMessage.data.version, validMessage.origin);
        }

        return null;
    }
}
