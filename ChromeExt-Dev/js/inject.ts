const InjectButtonClass = "btn-inject-copy";
class CopyAwesomeFontInject {

    init() {
        const listing = this.listingElement;
        if (!listing) {
            window.setTimeout(() => this.init(), 500);
            return;
        }

        const observer = new MutationObserver(() => this.onDomChanged());
        observer.observe(listing, {
            subtree: true,
            childList: true,
        });

        listing.addEventListener("click", ev => void this.onListingClick(ev));
        this.onDomChanged();
    }

    private onListingClick(ev: Event) {
        let target = ev.target as HTMLElement;
        let acquired = false;
        while (target) {
            if (target.classList.contains(InjectButtonClass)) {
                acquired = true;
                break;
            }

            target = target.parentElement;
        }

        if (!acquired) { return; }

        ev.preventDefault();

        const article = target.closest<HTMLElement>("article");
        if (!article) { return; }

        const icon = article.querySelector("i");
        if (!icon) { return; }

        const classes = Array.from(icon.classList);
        void this.copyAsync(classes);
    }

    private async copyAsync(classes: string[]) {
        const type = await new Promise<number>(r => {
            chrome.runtime.sendMessage({
                op: "getCopyType",
            }, type => r(type));
        });

        let content = type > 0 ?
            classes[1] : classes[1].replace("fa-", "");
        if (type > 1) {
            content = `${classes[0]} ${content}`;
        }

        await navigator.clipboard.writeText(content);
    }

    private onDomChanged() {
        const listing = this.listingElement;
        if (!listing) { return; }

        const articles = listing.querySelectorAll(":scope > article:not(.copy-added)");
        for (const articleEl of articles) {
            const a = document.createElement("a");
            a.classList.add(InjectButtonClass);
            a.href = "#";
            a.innerHTML = `<i class="fa fa-copy"></i>`;

            articleEl.appendChild(a);
            articleEl.classList.add("copy-added");
        }
    }

    private get listingElement() {
        return document.querySelector(".icon-listing");
    }
}
new CopyAwesomeFontInject().init();