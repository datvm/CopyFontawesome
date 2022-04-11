import { ChrUtils } from "./common-chrome.js";
class PopupPage {
    chkFree = document.querySelector("#chk-free");
    lnkSearch = document.querySelector(".lnk-search");
    async init() {
        document.body.loc();
        await this.setSearchHrefAsync();
        this.chkFree.addEventListener("change", () => void this.onFreeCheckChanged());
        const type = await ChrUtils.sendMessageAsync({
            op: "getCopyType",
        });
        document.querySelector(`[name="copy-type"][value="${type}"]`)
            .checked = true;
        document.querySelector(".copy-options").addDelegate("change", `input[name="copy-type"]`, (_, el) => {
            if (el.checked) {
                this.onChecked(el);
            }
        });
    }
    async onFreeCheckChanged() {
        await ChrUtils.sendMessageAsync({
            op: "setFreeSearch",
            value: this.chkFree.checked,
        });
        await this.setSearchHrefAsync();
    }
    async setSearchHrefAsync() {
        const freeOnly = await ChrUtils.sendMessageAsync({
            op: "getFreeSearch",
        });
        this.chkFree.checked = freeOnly;
        const lnk = this.lnkSearch;
        const base = lnk.getAttribute("data-href");
        lnk.setAttribute("href", base + (freeOnly ? "?m=free" : ""));
    }
    async onChecked(opt) {
        await ChrUtils.sendMessageAsync({
            op: "setCopyType",
            value: Number(opt.value),
        });
    }
}
new PopupPage().init();
//# sourceMappingURL=popup.js.map