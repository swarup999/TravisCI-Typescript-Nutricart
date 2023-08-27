import { ChromeMessage, Sender } from "../types";

type MessageResponse = (response?: any) => void

const messagesFromReactAppListener = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    response: MessageResponse
) => {
    response('Hello from content.js');
}

const main = () => {
    console.log('[content.ts] Main')
    /**
     * Fired when a message is sent from either an extension process or a content script.
     */
    chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
}

main();