interface IOfficeClientAppProtocol {
    applicationKey: string;
    mime: string;
    prefix: string;
    extensions: string[];
}

export class OfficeClientAppService {
    private static protocols: IOfficeClientAppProtocol[] = [
        {
            applicationKey: "word",
            mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            prefix: "ms-word:ofe|u|",
            extensions: ["doc", "docx", "docm"],
        },
        {
            applicationKey: "powerpoint",
            mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            prefix: "ms-powerpoint:ofe|u|",
            extensions: ["ppt", "pptx", "pptm", "pps", "ppsx", "ppsm"],
        },
        {
            applicationKey: "excel",
            mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            prefix: "ms-excel:ofe|u|",
            extensions: ["xls", "xlsx", "xlsm", "csv"],
        },
    ];

    public static hasInvokeAppHeader(headers: chrome.webRequest.HttpHeader[]): boolean {
        return headers.some((header) => {
            return header.name === "x-ms-invokeapp"
                && header.value !== undefined
                && header.value.startsWith("1");
        });
    }

    public static prefixUrlWithProtocolBasedOnHeaders(url: string, headers: chrome.webRequest.HttpHeader[]): string {
        if (this.isOfficeClientAppProtocolUrl(url)) {
            throw Error(`Url is already prefixed with protocol: "${url}".`,);
        }

        const contentTypeHeader = headers.find((header) => {
            return header.name === "content-type"
                && header.value !== undefined
        });
        if (contentTypeHeader === undefined) {
            throw Error("No \"content-type\" header found.");
        }

        const protocol = this.protocols.find((p) => p.mime === contentTypeHeader.value);
        if (protocol === undefined) {
            throw Error(`No protocol found for content-type "${contentTypeHeader.value}".`);
        }

        return `${protocol.prefix}${url}`;
    }

    private static isOfficeClientAppProtocolUrl(url: string): boolean {
        return this.protocols.some((protocol) => url.startsWith(protocol.prefix));
    }
}
