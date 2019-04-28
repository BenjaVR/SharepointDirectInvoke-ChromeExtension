interface IOfficeClientAppProtocol {
    applicationKey: string;
    mime: string;
    prefix: string;
    extensions: string[];
}

interface IUrlWithMime {
    url: string;
    mime: string;
}

export class OfficeClientAppService {
    public static protocols: IOfficeClientAppProtocol[] = [
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

    public static isOfficeClientAppProtocolUrl(url: string): boolean {
        return this.protocols.some((protocol) => url.startsWith(protocol.prefix));
    }

    public static isOfficeClientAppMime(mime: string): boolean {
        return this.protocols.some((protocol) => protocol.mime === mime);
    }

    public static prefixUrlWithProtocolBasedOnMime(urlWithMime: IUrlWithMime): string {
        const protocol = this.protocols.find((p) => p.mime === urlWithMime.mime);
        if (protocol === undefined) {
            throw new Error(`No protocol found with MIME type "${urlWithMime.mime}".`);
        }
        return `${protocol.prefix}${urlWithMime.url}`;
    }
}
