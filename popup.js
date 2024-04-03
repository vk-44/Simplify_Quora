document.addEventListener("DOMContentLoaded", run);

function sendMessage(value) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { todo: value });
  });
}

function run() {
  const ads = document.getElementById("ads");
  const promoted = document.getElementById("promoted");
  const bot = document.getElementById("bot");
  const signIn = document.getElementById("signIn");
  const related = document.getElementById("related");

  const arrayOfElements = [ads, promoted, bot, signIn, related];
  for (const item of arrayOfElements) {
    const argumentValue = item.textContent.split(" ")[1];
    item.addEventListener("click", () => sendMessage(argumentValue));
  }
}
