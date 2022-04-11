class ChrUtilsClass {
    registerActionClick(url) {
        chrome.action.onClicked.addListener(() => {
            chrome.tabs.create({
                url,
            });
        });
    }
    sendMessageAsync(msg) {
        return new Promise(r => {
            chrome.runtime.sendMessage(msg, res => r(res));
        });
    }
    sendTabMessageAsync(tabId, msg) {
        return new Promise(r => {
            chrome.tabs.sendMessage(tabId, msg, res => r(res));
        });
    }
    async getActiveTabAsync() {
        return (await chrome.tabs.query({
            active: true,
        }))[0];
    }
    async getActiveTabIdAsync() {
        return (await this.getActiveTabAsync())?.id;
    }
    async insertCssAsync(tabId, files, allFrames = false) {
        if (!tabId) {
            tabId = await this.getActiveTabIdAsync();
            if (!tabId) {
                return;
            }
        }
        for (const file of files) {
            await chrome.scripting.insertCSS({
                target: {
                    tabId,
                    allFrames,
                },
                files: [file],
            });
        }
    }
    async injectScriptsAsync(tabId, files, allFrames = false) {
        if (!tabId) {
            tabId = await this.getActiveTabIdAsync();
            if (!tabId) {
                return;
            }
        }
        for (const file of files) {
            await chrome.scripting.executeScript({
                target: {
                    tabId,
                    allFrames,
                },
                files: [file],
            });
        }
    }
}
export const ChrUtils = new ChrUtilsClass();
//# sourceMappingURL=common-chrome.js.map