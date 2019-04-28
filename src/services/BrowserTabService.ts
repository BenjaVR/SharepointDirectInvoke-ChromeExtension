export class BrowserTabService {
    public static async doesTabExist(tabId?: number): Promise<boolean> {
        return new Promise((resolve, _) => {
            if (tabId === undefined) {
                return resolve(false);
            }
            chrome.tabs.get(tabId, function() {
                if (chrome.runtime.lastError) {
                    return resolve(false);
                }
                return resolve(true);
            });
        });
    }
}
