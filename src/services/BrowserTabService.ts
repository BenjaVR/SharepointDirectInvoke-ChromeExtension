export class BrowserTabService {
    public static async doesTabExist(tabId: number): Promise<boolean> {
        return new Promise(function(resolve, _) {
            chrome.tabs.get(tabId, function() {
                if (chrome.runtime.lastError) {
                    return resolve(false);
                }
                return resolve(true);
            });
        });
    }
}
