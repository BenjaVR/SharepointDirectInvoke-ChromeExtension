import { OfficeClientAppService } from "./OfficeClientAppService";

chrome.webRequest.onHeadersReceived.addListener(
    (details: chrome.webRequest.WebResponseHeadersDetails): chrome.webRequest.BlockingResponse | void => {
        const headers = details.responseHeaders;
        if (headers == undefined) {
            return;
        }
        const hasInvokeAppHeader = OfficeClientAppService.hasInvokeAppHeader(headers);
        if (!hasInvokeAppHeader) {
            return;
        }
        if (!confirm("Open in Office client app?")) { // TODO: localize & make more specific based on the actual app that will be opened?
            return;
        }
        const urlWithProtocol = OfficeClientAppService.prefixUrlWithProtocolBasedOnHeaders(details.url, headers);
        return {
            redirectUrl: urlWithProtocol,
        };
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders", "blocking"]
);
