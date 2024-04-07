//Global Variables
const URL = window.location.href;

//Utility function used by other functions further down in code
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

//Function to remove signin popup
const signin = () => {
  const signinPopup = document
    .getElementsByClassName(
      "q-flex qu-alignItems--center qu-justifyContent--center qu-overflow--hidden qu-zIndex--blocking_wall"
    )
    .item(0);

  if (!URL.endsWith("?share=1") && signinPopup) {
    const newURL = URL + "?share=1";
    chrome.runtime.sendMessage({ action: "modifyUrl", newURL });
  }
};

//Function to remove ads
const ads = () => {
  const adsElement = document.getElementsByClassName("q-sticky").item(0);
  const adsInMainElement = document.getElementsByClassName(
    "q-text qu-dynamicFontSize--small qu-color--gray_light qu-passColorToLinks"
  );

  if (adsElement) adsElement.style.display = "none";
  for (const item of adsInMainElement) {
    if (item.innerHTML.startsWith("Ad")) {
      classRemover(item, "qu-borderBottom");
    }
  }
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

//Function to remove bots
const bot = () => {
  console.log("bot");
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

  if (URL.includes("/unanswered/")) return;
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

    setTimeout(() => {
      bot();
    }, 1000);
  }, 1000);
};

// Send a message to background script to get data
chrome.runtime.sendMessage({ action: "getData" }, (response) => {
  console.log("Received data:", response);

  // Create a MutationObserver to watch for changes in the DOM
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        for (let node of mutation.addedNodes) {
          if (response.bot && node.classList.contains("q-click-wrapper")) bot();

          if (
            response.promoted &&
            node.classList.contains("spacing_log_question_page_ad")
          )
            promoted();
        }
      }
    }
  });

  const targetNode = document.getElementById("mainContent");
  observer.observe(targetNode, {
    childList: true,
    subtree: true,
  });

  if (response.signin) signin();

  if (response.ads) ads();

  if (response.promoted) promoted();

  if (response.bot) bot();

  if (response.related) related();
});

//Work on related function
//Use loading spinner while page loads
//Hightlight originally answered
