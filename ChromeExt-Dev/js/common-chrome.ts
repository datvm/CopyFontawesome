class ChrUtilsClass {

    /**
     * Register for background page to open a URL when user click the icon. MUST be called before becoming async.
     * @param url URL to open on click
     */
    registerActionClick(url: string) { // Do not async this
        chrome.action.onClicked.addListener(() => {
            chrome.tabs.create({
                url,
            });
        });
    }

    sendMessageAsync<T = any>(msg: any): Promise<T> {
        return new Promise<T>(r => {
            chrome.runtime.sendMessage(msg, res => r(res));
        });
    }

    sendTabMessageAsync<T = any>(tabId: number, msg: any): Promise<T> {
        return new Promise<T>(r => {
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

    async insertCssAsync(tabId: number | undefined, files: string[], allFrames = false) {
        if (!tabId) {
            tabId = await this.getActiveTabIdAsync();

            if (!tabId) { return; }
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

    async injectScriptsAsync(tabId: number | undefined, files: string[], allFrames = false) {
        if (!tabId) {
            tabId = await this.getActiveTabIdAsync();

            if (!tabId) { return; }
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