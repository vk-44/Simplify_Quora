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

//Function to remove signin popup
const signin = () => {
  const URL = window.location.href;

  if (!URL.endsWith("?share=1")) {
    const newURL = URL + "?share=1";
    chrome.runtime.sendMessage({ action: "modifyUrl", newURL });
  }
};

//Function to remove ads
const ads = () => {
  const adsElement = document.getElementsByClassName("q-sticky").item(0);
  if (adsElement) adsElement.style.display = "none";
};

//Function to remove promoted ads and sponsorships
const promoted = () => {
  console.log("promoted");
  const promotedList = document.getElementsByClassName(
    "spacing_log_question_page_ad"
  );

  if (promotedList) {
    for (const item of promotedList) {
      item.style.display = "none";
    }
  }
};

//Utility function used by functions further down in code
const classRemover = (element, className) => {
  const findParent = (element, className) => {
    if (!element || !element.classList) return null;
    if (element.classList.contains(className)) {
      return element;
    } else {
      return findParent(element.parentElement, className);
    }
  };

  const parent = findParent(element, className);
  if (parent) parent.style.display = "none";
};

//Function to remove bots
const bot = () => {
  const botElementList = document.querySelectorAll(
    ".q-inlineFlex.qu-alignItems--center.qu-wordBreak--break-word"
  );

  let botElement;
  for (const item of botElementList) {
    const val = item.querySelector("span");
    const res = val.querySelector("span").innerHTML;
    if (res === "Assistant") botElement = item;
  }

  if (botElement) classRemover(botElement, "qu-borderAll");
};

//Function to remove related answers
const related = () => {
  console.log("related");
  // const relatedList = document.getElementsByClassName("q-box qu-mb--tiny");

  // for (const item of relatedList) classRemover(item, "qu-borderAll");

  const popup = document
    .getElementsByClassName(
      "q-click-wrapper qu-active--bg--darken qu-borderRadius--pill qu-alignItems--center qu-justifyContent--center qu-whiteSpace--nowrap qu-userSelect--none qu-display--inline-flex qu-tapHighlight--white qu-textAlign--center qu-cursor--pointer qu-hover--bg--darken ClickWrapper___StyledClickWrapperBox-zoqi4f-0 daLTSH base___StyledClickWrapper-lx6eke-1 hDHfXl  "
    )
    .item(1)
    .click();

  setTimeout(() => {
    document
      .getElementsByClassName(
        "q-click-wrapper qu-p--medium qu-px--medium qu-py--small qu-alignItems--center qu-justifyContent--space-between qu-display--flex qu-bg--raised qu-tapHighlight--white qu-cursor--pointer qu-hover--bg--darken qu-hover--textDecoration--underline ClickWrapper___StyledClickWrapperBox-zoqi4f-0 daLTSH puppeteer_test_popover_item"
      )
      .item(1)
      .click();
  }, 350);
};

// Send a message to background script to get data
chrome.runtime.sendMessage({ action: "getData" }, (response) => {
  console.log("Received data:", response);

  if (response.signin) signin();

  if (response.ads) ads();

  if (response.promoted) promoted();

  if (response.bot) bot();

  if (response.related) related();

  // Create a MutationObserver to watch for changes in the DOM
  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        // Check if any new elements were added
        if (mutation.addedNodes.length > 0) {
          // if (response.related) related();
          if (response.promoted) promoted();
          if (response.bot) bot();
          // handleLazyLoad();
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
