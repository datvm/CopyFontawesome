export class WelcomePage {

    constructor() {
        let homepage = chrome.runtime.getManifest().homepage_url;
        if (!homepage) { throw new Error("Homepage is not set in manifest"); }

        if (homepage.endsWith("/")) { homepage = homepage.substring(0, homepage.length - 1); }

        chrome.runtime.onInstalled.addListener(details => this.onInstalled(details, homepage!));
        this.setUninstallURL(homepage);
    }

    private onInstalled(details: chrome.runtime.InstalledDetails, homepage: string) {
        if (details.reason != "install" || !homepage) { return; }

        chrome.tabs.create({
            url: homepage + "/welcome",
        });
    }

    private setUninstallURL(homepage: string) {
        chrome.runtime.setUninstallURL(homepage + "/uninstall");
    }

}