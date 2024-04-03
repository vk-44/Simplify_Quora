//Removes ads
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.todo === "ads") {
    document.getElementsByClassName("q-sticky").item(0).style.display = "none";
  }

  if (message.todo === "promoted") {
    const promotedList = document.getElementsByClassName(
      "spacing_log_question_page_ad"
    );

    for (const item of promotedList) {
      item.style.display = "none";
    }
  }

  if (message.todo === "bot") {
    const botElement = document
      .getElementsByClassName(
        "q-click-wrapper qu-display--block qu-tapHighlight--white qu-cursor--pointer ClickWrapper___StyledClickWrapperBox-zoqi4f-0 daLTSH"
      )
      .item(0);

    if (botElement) {
      botElement.style.display = "none";
    }
  }

  if (message.todo === "sign") {
    //Removing SignIn popup box and background blur
    const signInElement = document
      .getElementsByClassName(
        "q-flex qu-alignItems--center qu-justifyContent--center qu-overflow--hidden qu-zIndex--blocking_wall"
      )
      .item(0);

    if (signInElement) {
      signInElement.style.display = "none";
      signInElement.parentElement.previousElementSibling.style.filter = "";
    }

    //Removing overflow property
    document
      .getElementsByClassName(
        "q-platform--desktop q-color-mode--dark qu-color--gray_ultralight"
      )
      .item(0).style.overflow = "";
  }

  if (message.todo === "related") {
    const relatedList = document.getElementsByClassName("q-box qu-mb--tiny");
  }
});

// console.log(document.getElementsByClassName("spacing_log_question_page_ad"));

// quora --- https://www.quora.com/I-am-25-Can-I-learn-React-and-get-a-job?share=1

// blur remove -----
// const html = document.getElementsByClassName("q-platform--desktop q-color-mode--dark qu-color--gray_ultralight")

// document.getElementsByClassName("q-flex qu-alignItems--center qu-justifyContent--center qu-overflow--hidden qu-zIndex--blocking_wall")

// child.item(0).parentElement.previousElementSibling.style.filter = "none"

// related answer remove ----
// const deeplyNestedCode = document.getElementsByClassName("q-box qu-mb--tiny")

// "q-box dom_annotate_question_answer_item_2 qu-borderAll qu-borderRadius--small qu-borderColor--raised qu-boxShadow--small qu-mb--small qu-bg--raised"

// promoted answer remove ---- const ad = document.getElementsByClassName("spacing_log_question_page_ad")

// ads remove ---- const ads = document.getElementsByClassName("q-sticky")

// bot remove -------- q-click-wrapper qu-display--block qu-tapHighlight--white qu-cursor--pointer ClickWrapper___StyledClickWrapperBox-zoqi4f-0 daLTSH
