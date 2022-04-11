import { ChrUtils } from "./common-chrome.js";

class PopupPage {

    async init() {
        document.body.loc();

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

    private async onChecked(opt: HTMLInputElement) {
        await ChrUtils.sendMessageAsync({
            op: "setCopyType",
            value: Number(opt.value),
        });
    }

}

new PopupPage().init();