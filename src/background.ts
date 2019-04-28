import { OfficeClientAppService } from "./services/OfficeClientAppService";
import { BrowserTabService } from "./services/BrowserTabService";

chrome.downloads.onCreated.addListener((downloadItem: chrome.downloads.DownloadItem) => {
    if (OfficeClientAppService.isOfficeClientAppMime(downloadItem.mime)) {
        chrome.downloads.pause(downloadItem.id);
        if (confirm("Open in client app?")) {
            chrome.downloads.search({ id: downloadItem.id }, (results: chrome.downloads.DownloadItem[]) => {
                results.forEach((downloadItemResult: chrome.downloads.DownloadItem) => {
                    cancelAndRemoveDownload(downloadItemResult);
                });
            });

            // Create new tab with the url with Office protocol prepended.
            chrome.tabs.create(
                {
                    url: OfficeClientAppService.prefixUrlWithProtocolBasedOnMime({
                        url: downloadItem.url,
                        mime: downloadItem.mime,
                    }),
                    selected: false,
                },
                (tab: chrome.tabs.Tab) => {
                    window.setTimeout(async () => {
                        const doesTabExist = await BrowserTabService.doesTabExist(tab.id);
                        if (doesTabExist && tab.id !== undefined) {
                            chrome.tabs.remove(tab.id);
                        }
                    }, 100); // Hack to make sure the tab is not closed before the client app can open.
                }
            );
        } else {
            chrome.downloads.resume(downloadItem.id);
        }
    }
});

function cancelAndRemoveDownload(downloadItem: chrome.downloads.DownloadItem): void {
    const isFileDeletable = !downloadItem.canResume && downloadItem.exists;
    if (downloadItem.canResume) {
        chrome.downloads.cancel(downloadItem.id, () => {
            if (isFileDeletable) {
                chrome.downloads.removeFile(downloadItem.id);
            }
        });
    } else if (isFileDeletable) {
        chrome.downloads.removeFile(downloadItem.id);
    }
    chrome.downloads.erase({ id: downloadItem.id }, () => {});
}
