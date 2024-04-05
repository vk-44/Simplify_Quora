//Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getData") {
    chrome.storage.local.get(["obj"]).then((res) => sendResponse(res.obj));

    // Return true to indicate we will respond asynchronously
    return true;
  }

  if (request.action === "modifyUrl") {
    chrome.tabs.update(sender.tab.id, { url: request.newURL });
  }
});
