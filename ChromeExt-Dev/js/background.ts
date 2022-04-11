import { WelcomePage } from "./welcome.js";

const CopyStorageKey = "StorageType";

class BackgroundPage {

    initialize() {
        new WelcomePage();

        chrome.runtime.onMessage.addListener((...params) => this.onMessage(...params));
    }

    onMessage(...params: ChMsgListenerParams) {
        const [msg, sender, sendRes] = params;

        if (!msg?.op || sender.id != chrome.runtime.id) { return; }

        switch (msg.op) {
            case "getCopyType":
                chrome.storage.local.get(CopyStorageKey, s =>
                    sendRes(s[CopyStorageKey] || 0));
                return true;
            case "setCopyType":
                chrome.storage.local.set({
                    [CopyStorageKey]: msg.value
                }, () => sendRes(undefined));
                return true;
        }
    }

}

new BackgroundPage().initialize();