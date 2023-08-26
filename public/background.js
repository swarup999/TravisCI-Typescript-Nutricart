chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ isFirstInstallation: true });
});
  