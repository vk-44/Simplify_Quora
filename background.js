// // Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getMyData") {
    chrome.storage.local
      .get(["signin"])
      .then((res) => sendResponse(res.signin));
    // Return true to indicate we will respond asynchronously
    return true;
  }

  if (request.action === "modifyUrl") {
    chrome.tabs.update(sender.tab.id, { url: request.newURL });
  }
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "modifyUrl") {
//     chrome.tabs.update(sender.tab.id, { url: message.newURL });
//   }
// });
