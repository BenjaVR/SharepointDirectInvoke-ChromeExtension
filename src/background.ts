var protocols: { [key: string]: { prefix: string; extensions: string[] } } = {
    word: {
        prefix: "ms-word:ofe|u|",
        extensions: ["doc", "docx", "docm"],
    },
    powerpoint: {
        prefix: "ms-powerpoint:ofe|u|",
        extensions: ["ppt", "pptx", "pptm", "pps", "ppsx", "ppsm"],
    },
    excel: {
        prefix: "ms-excel:ofe|u|",
        extensions: ["xls", "xlsx", "xlsm", "csv"],
    },
};

var sharepointUrlPattern = "*://*.sharepoint.com/*";

chrome.webRequest.onBeforeRedirect.addListener(closeRedirectedTab, { urls: [sharepointUrlPattern] });

Object.keys(protocols).forEach((protocolKey) => {
    chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
            console.log("onBeforeRequest", details);
            if (confirm("Open in client app?")) {
                return {
                    redirectUrl: protocols[protocolKey].prefix + details.url,
                };
            }
        },
        {
            urls: protocols[protocolKey].extensions.map((ext) => `${sharepointUrlPattern}.${ext}`),
            types: ["main_frame"],
        },
        ["blocking"]
    );
});

async function closeRedirectedTab(details: chrome.webRequest.WebRedirectionResponseDetails) {
    console.log("closeRedirectedTab", details);

    var tabExists = await doesTabExists(details.tabId);
    var isOpenedInOfficeClientApp = isOfficeClientUrl(details.redirectUrl);
    if (tabExists && isOpenedInOfficeClientApp) {
        chrome.tabs.remove(details.tabId);
    }
}

function isOfficeClientUrl(url: string) {
    return Object.keys(protocols).some(function(protocolKey) {
        return url.startsWith(protocols[protocolKey].prefix);
    });
}

async function doesTabExists(tabId: number) {
    return new Promise(function(resolve, _) {
        chrome.tabs.get(tabId, function() {
            if (chrome.runtime.lastError) {
                return resolve(false);
            }
            return resolve(true);
        });
    });
}
