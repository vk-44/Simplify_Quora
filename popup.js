//Do things after DOM content loaded.
document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = {
    signin: document.getElementById("signinCheckbox"),
    ads: document.getElementById("adsCheckbox"),
    promoted: document.getElementById("promotedCheckbox"),
    related: document.getElementById("relatedCheckbox"),
  };

  //Updating the local storage with new checkbox values when the change event fires
  const updateStorage = () => {
    const checkboxValues = {};
    for (const key in checkboxes) {
      checkboxValues[key] = checkboxes[key].checked;
    }
    chrome.storage.local.set({ checkboxValues });
  };

  //Get the values from storage and set it to the checkboxes while opening extension's popup
  const loadFromStorage = () => {
    chrome.storage.local.get(["checkboxValues"]).then((res) => {
      const storedValues = res.checkboxValues;
      for (const key in checkboxes) {
        checkboxes[key].checked = storedValues[key];
      }
    });
  };

  loadFromStorage();

  //Adding Event Listener's to all the checkbox elements
  for (const key in checkboxes) {
    checkboxes[key].addEventListener("change", updateStorage);
  }
});
