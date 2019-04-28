import { BrowserTabService } from "./services/BrowserTabService";
import { OfficeClientAppService, IOfficeClientAppProtocol } from "./services/OfficeClientAppService";
import { SHAREPOINT_URL_PATTERN } from "./constants";

function openInClientApp(protocol: IOfficeClientAppProtocol, details: chrome.webRequest.WebRequestBodyDetails) {
    if (confirm("Open in client app?")) {
        return {
            redirectUrl: protocol.prefix + details.url,
        };
    }
}
OfficeClientAppService.protocols.forEach((protocol) => {
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => openInClientApp(protocol, details),
        {
            urls: protocol.extensions.map((ext) => `${SHAREPOINT_URL_PATTERN}.${ext}`),
            types: ["main_frame"],
        },
        ["blocking"]
    );
});

async function closeRedirectedTab(details: chrome.webRequest.WebRedirectionResponseDetails) {
    var tabExists = await BrowserTabService.doesTabExist(details.tabId);
    var isOpenedInOfficeClientApp = OfficeClientAppService.isOfficeClientAppProtocolUrl(details.redirectUrl);
    if (tabExists && isOpenedInOfficeClientApp) {
        chrome.tabs.remove(details.tabId);
    }
}
chrome.webRequest.onBeforeRedirect.addListener(closeRedirectedTab, { urls: [SHAREPOINT_URL_PATTERN] });
