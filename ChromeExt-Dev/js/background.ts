const CopyStorageKey = "StorageType";
const SearchFreeIcons = "FreeIconOnly";

class BackgroundPage {

    initialize() {
        chrome.runtime.onInstalled.addListener(details => {
            if (details.reason === "install") {
                chrome.tabs.create({
                    url: "https://fontawesome.com/search",
                });
            }
        });

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
            case "getFreeSearch":
                chrome.storage.local.get(SearchFreeIcons, s =>
                    sendRes(s[SearchFreeIcons] ?? false));
                return true;
            case "setFreeSearch":
                chrome.storage.local.set({
                    [SearchFreeIcons]: msg.value
                }, () => sendRes(undefined));
                return true;
        }
    }

}

new BackgroundPage().initialize();