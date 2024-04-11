//Setting all the checkbox values to true when the extension is newly installed
chrome.runtime.onInstalled.addListener(() => {
  const checkboxValues = {
    signin: true,
    ads: true,
    promoted: true,
    related: true,
  };

  chrome.storage.local.set({ checkboxValues });
});

//Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //Returns the Object from chrome's local storage
  if (request.action === "getObj") {
    chrome.storage.local
      .get(["checkboxValues"])
      .then((res) => sendResponse(res.checkboxValues));

    // Return true to indicate we will respond asynchronously
    return true;
  }

  //Modifies the URL with newURL
  if (request.action === "modifyURL") {
    chrome.tabs.update(sender.tab.id, { url: request.newURL });
  }
});
