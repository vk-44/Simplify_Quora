//Global Variables
const URL = window.location.href;

//Utility function used by other functions further down in code
const classRemover = (element, className) => {
  //Finds the parent element of given child element. If found, sets the display to "none"
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

  if (!URL.endsWith("?") && signinPopup) {
    const newURL = URL + "?";
    //Sends message to background.js to modify the URL
    chrome.runtime.sendMessage({ action: "modifyURL", newURL });
  }
};

//Function to remove ads
const ads = () => {
  const adsElement = document.querySelector(".q-sticky");
  const adsInMainContentElement = document.querySelector(
    ".q-text.qu-dynamicFontSize--small.qu-color--gray_light.qu-passColorToLinks"
  );

  if (adsElement) adsElement.style.display = "none";
  if (
    adsInMainContentElement &&
    adsInMainContentElement.innerHTML.startsWith("Ad")
  )
    classRemover(adsInMainContentElement, "qu-borderBottom");
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
  const popupList = document.querySelectorAll(
    ".q-text.qu-ellipsis.qu-whiteSpace--nowrap"
  );
  let popup;
  for (const item of popupList) {
    if (item.innerHTML.startsWith("All related")) popup = item;
  }
  if (popup) {
    popup.click();
    setTimeout(() => {
      const answersButton = document
        .querySelectorAll(
          ".q-text.qu-dynamicFontSize--small.qu-color--gray_dark"
        )
        .item(1);
      if (answersButton) {
        answersButton.click();
      }
    }, 2000);
  }
};

// Send a message to background script to get data
chrome.runtime.sendMessage({ action: "getObj" }, (response) => {
  const {
    signin: signinValue,
    ads: adsValue,
    promoted: promotedValue,
    related: relatedValue,
  } = response;

  //Adding a loading spinner
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

  //Initially called when the content script fires in browser
  signinValue && signin();
  adsValue && ads();
  promotedValue && promoted();
  relatedValue && related();

  //Wait for 3 seconds and remove the loading spinner
  setTimeout(() => {
    document.getElementById("overlay")?.remove();
  }, 3000);
});
