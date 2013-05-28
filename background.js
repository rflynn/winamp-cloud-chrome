
// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
    if (/^http:\/\/www\.youtube\.com\/.*\bv=/.test(tab.url)) {
        chrome.pageAction.show(tabId);
    }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

var CONTENT = {};

// Called when a message is passed.  We assume that the content script
// wants to show the page action.
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    CONTENT = request; // save it for popup
    // Return nothing to let the connection be cleaned up.
    chrome.tabs.sendMessage(sender.tab.id, {});
});

