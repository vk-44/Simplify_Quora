document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = {
    signin: document.getElementById("signinCheckbox"),
    ads: document.getElementById("adsCheckbox"),
    promoted: document.getElementById("promotedCheckbox"),
    related: document.getElementById("relatedCheckbox"),
  };

  const updateStorage = () => {
    const checkboxValues = {};
    for (const key in checkboxes) {
      checkboxValues[key] = checkboxes[key].checked;
    }
    chrome.storage.local.set({ checkboxValues });
  };

  const loadFromStorage = () => {
    chrome.storage.local.get(["checkboxValues"]).then((res) => {
      const storedValues = res.checkboxValues;
      for (const key in checkboxes) {
        checkboxes[key].checked = storedValues[key];
      }
    });
  };

  loadFromStorage();

  for (const key in checkboxes) {
    checkboxes[key].addEventListener("change", updateStorage);
  }
});
