//Global Variables
const URL = window.location.href;

//Utility function used by other functions further down in code
const classRemover = (element, className) => {
  const findParent = (element, className) => {
    if (!element || !element.classList) return null;
    if (element.classList?.contains(className)) {
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
  const signinPopup = document.querySelector(
    ".q-flex.qu-alignItems--center.qu-justifyContent--center.qu-overflow--hidden.qu-zIndex--blocking_wall"
  );

  if (!URL.endsWith("?share=1") && signinPopup) {
    const newURL = URL + "?share=1";
    chrome.runtime.sendMessage({ action: "modifyUrl", newURL });
  }
};

//Function to remove ads
const ads = () => {
  const adsElement = document.querySelector(".q-sticky");
  const adsInMainElement = document.querySelectorAll(
    ".q-text.qu-dynamicFontSize--small.qu-color--gray_light.qu-passColorToLinks"
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
  const promotedList = document.querySelectorAll(
    ".spacing_log_question_page_ad"
  );

  if (promotedList) {
    for (const item of promotedList) {
      item.style.display = "none";
    }
  }
};

//Function to remove related answers
const related = () => {
  if (URL.includes("/unanswered/")) return;
  const popup = document
    .querySelectorAll(
      ".q-click-wrapper.qu-active--bg--darken.qu-borderRadius--pill.qu-alignItems--center.qu-justifyContent--center.qu-whiteSpace--nowrap.qu-userSelect--none.qu-display--inline-flex.qu-tapHighlight--white.qu-textAlign--center.qu-cursor--pointer.qu-hover--bg--darken.ClickWrapper___StyledClickWrapperBox-zoqi4f-0.daLTSH.base___StyledClickWrapper-lx6eke-1.hDHfXl"
    )
    .item(1);

  if (popup) {
    popup.click();
    setTimeout(() => {
      const answersButton = document
        .querySelectorAll(
          ".q-click-wrapper.qu-p--medium.qu-px--medium.qu-py--small.qu-alignItems--center.qu-justifyContent--space-between.qu-display--flex.qu-bg--raised.qu-tapHighlight--white.qu-cursor--pointer.qu-hover--bg--darken.qu-hover--textDecoration--underline.ClickWrapper___StyledClickWrapperBox-zoqi4f-0.daLTSH.puppeteer_test_popover_item"
        )
        .item(1);
      if (answersButton) {
        answersButton.click();
      }
    }, 2000);
  }
};

// Send a message to background script to get data
chrome.runtime.sendMessage({ action: "getData" }, (response) => {
  const {
    signin: signinValue,
    ads: adsValue,
    promoted: promotedValue,
    related: relatedValue,
  } = response;

  if (signinValue || adsValue || promotedValue || relatedValue) {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.innerHTML = `
    <style>
      .spinner {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        position: relative;
        animation: rotate 1s linear infinite
      }
      .spinner::before , .spinner::after {
        content: "";
        box-sizing: border-box;
        position: absolute;
        inset: 0px;
        border-radius: 50%;
        border: 5px solid #FFF;
        animation: prixClipFix 2s linear infinite ;
      }
      .spinner::after{
        border-color: #f52936;
        animation: prixClipFix 2s linear infinite , rotate 0.5s linear infinite reverse;
        inset: 6px;
      }

      @keyframes rotate {
        0%   {transform: rotate(0deg)}
        100%   {transform: rotate(360deg)}
      }

      @keyframes prixClipFix {
        0%   {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}
        25%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}
        50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
        75%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)}
        100% {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)}
      }

        #overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        backdrop-filter: blur(15px);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }

      #overlay p {
        margin-top: 10px;
        font-weight: bold;
        color: #f52936;
      }
    </style>
    <div class="spinner"></div>
    <p>Clearing the Clutter...</p>
  `;
    document.body.appendChild(overlay);
  }

  // Create a MutationObserver to watch for changes in the targetNode
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (
            promotedValue &&
            node.classList?.contains("spacing_log_question_page_ad")
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

  signinValue && signin();
  adsValue && ads();
  promotedValue && promoted();
  relatedValue && related();

  setTimeout(() => {
    document.getElementById("overlay")?.remove();
  }, 3000);
});
