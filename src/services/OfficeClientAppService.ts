export interface IOfficeClientAppProtocol {
    applicationKey: string;
    prefix: string;
    extensions: string[];
}

export class OfficeClientAppService {
    public static protocols: IOfficeClientAppProtocol[] = [
        {
            applicationKey: "word",
            prefix: "ms-word:ofe|u|",
            extensions: ["doc", "docx", "docm"],
        },
        {
            applicationKey: "powerpoint",
            prefix: "ms-powerpoint:ofe|u|",
            extensions: ["ppt", "pptx", "pptm", "pps", "ppsx", "ppsm"],
        },
        {
            applicationKey: "excel",
            prefix: "ms-excel:ofe|u|",
            extensions: ["xls", "xlsx", "xlsm", "csv"],
        },
    ];

    public static isOfficeClientAppProtocolUrl(url: string): boolean {
        return this.protocols.some((protocol) => url.startsWith(protocol.prefix));
    }
}
