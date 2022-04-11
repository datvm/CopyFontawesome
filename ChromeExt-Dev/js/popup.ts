import { ChrUtils } from "./common-chrome.js";

class PopupPage {

    chkFree: HTMLInputElement = document.querySelector("#chk-free")!;
    lnkSearch: HTMLAnchorElement = document.querySelector(".lnk-search")!;

    async init() {
        document.body.loc();

        await this.setSearchHrefAsync();
        this.chkFree.addEventListener("change", () => void this.onFreeCheckChanged());

        const type: number = await ChrUtils.sendMessageAsync({
            op: "getCopyType",
        });

        document.querySelector<HTMLInputElement>(
            `[name="copy-type"][value="${type}"]`)!
            .checked = true;

        document.querySelector(".copy-options")!.addDelegate(
            "change", `input[name="copy-type"]`,
            (_, el) => {
                if (el.checked) { this.onChecked(el as HTMLInputElement); }
            }
        );
    }

    private async onFreeCheckChanged() {
        await ChrUtils.sendMessageAsync({
            op: "setFreeSearch",
            value: this.chkFree.checked,
        });

        await this.setSearchHrefAsync();
    }

    private async setSearchHrefAsync() {
        const freeOnly: boolean = await ChrUtils.sendMessageAsync({
            op: "getFreeSearch",
        });
        this.chkFree.checked = freeOnly;

        const lnk = this.lnkSearch;
        const base = lnk.getAttribute("data-href");
        
        lnk.setAttribute("href", base + (freeOnly ? "?m=free" : ""));
    }

    private async onChecked(opt: HTMLInputElement) {
        await ChrUtils.sendMessageAsync({
            op: "setCopyType",
            value: Number(opt.value),
        });
    }

}

new PopupPage().init();