var protocols = {
    word: {
        prefix: "ms-word:ofe|u|",
        extensions: ["doc", "docx", "docm"]
    },
    powerpoint: {
        prefix: "ms-powerpoint:ofe|u|",
        extensions: ["ppt", "pptx", "pptm", "pps", "ppsx", "ppsm"]
    },
    excel: {
        prefix: "ms-excel:ofe|u|",
        extensions: ["xls", "xlsx", "xlsm", "csv"]
    },
}

Object.keys(protocols).forEach((protocolKey) => {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            if (confirm("Open in client app?")) {
                return {
                    redirectUrl: protocols[protocolKey].prefix + details.url
                };
            }
        }, {
            urls: protocols[protocolKey].extensions
                .map((ext) => `*://*.sharepoint.com/*.${ext}`),
            types: ["main_frame"]
        },
        ["blocking"]
    );
});
