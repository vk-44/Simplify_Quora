//   const signInElement = document
//     .getElementsByClassName(
//       "q-flex qu-alignItems--center qu-justifyContent--center qu-overflow--hidden qu-zIndex--blocking_wall"
//     )
//     .item(0);

//   const overflowElement = document
//     .getElementsByClassName(
//       "q-platform--desktop q-color-mode--dark qu-color--gray_ultralight"
//     )
//     .item(0);

//     //Removing SignIn popup box and background blur
//     signInElement.style.display = "none";
//     signInElement.parentElement.previousElementSibling.style.filter = "";

//     //Removing overflow property
//     overflowElement.style.overflow = "";

// Send a message to background script to get data
chrome.runtime.sendMessage({ action: "getData" }, (response) => {
  console.log("Received data:", response);

  if (response.signin) {
    const URL = window.location.href;

    if (!URL.endsWith("?share=1")) {
      const newURL = URL + "?share=1";
      chrome.runtime.sendMessage({ action: "modifyUrl", newURL });
    }
  }

  if (response.ads) {
    const adsElement = document.getElementsByClassName("q-sticky").item(0);
    if (adsElement) adsElement.style.display = "none";
  }

  if (response.promoted) {
    const promotedList = document.getElementsByClassName(
      "spacing_log_question_page_ad"
    );

    if (promotedList) {
      for (const item of promotedList) {
        item.style.display = "none";
      }
    }
  }

  if (response.bot) {
    const botElement = document
      .getElementsByClassName(
        "q-click-wrapper qu-display--block qu-tapHighlight--white qu-cursor--pointer ClickWrapper___StyledClickWrapperBox-zoqi4f-0 daLTSH"
      )
      .item(0);

    if (botElement) botElement.style.display = "none";
  }

  if (response.related) {
    const relatedList = document.getElementsByClassName("q-box qu-mb--tiny");

    for (const item of relatedList) {
      function findParent(element, className) {
        if (!element || !element.classList) return null;
        if (element.classList.contains(className)) {
          return element;
        } else {
          return findParent(element.parentElement, className);
        }
      }
      const parent = findParent(item, "qu-borderAll");
      if (parent) parent.style.display = "none";
    }
  }
});
