import { ChrUtils } from "./common-chrome.js";
class PopupPage {
    async init() {
        document.body.loc();
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
    async onChecked(opt) {
        await ChrUtils.sendMessageAsync({
            op: "setCopyType",
            value: Number(opt.value),
        });
    }
}
new PopupPage().init();
//# sourceMappingURL=popup.js.map