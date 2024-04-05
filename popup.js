document.addEventListener("DOMContentLoaded", () => {
  const signin = document.getElementById("signin");
  const ads = document.getElementById("ads");
  const promoted = document.getElementById("promoted");
  const bot = document.getElementById("bot");
  const related = document.getElementById("related");

  const arrayOfElements = [signin, ads, promoted, bot, related];

  chrome.storage.local.get(["obj"]).then((res) => {
    const resObj = res.obj;
    signin.checked = resObj.signin;
    ads.checked = resObj.ads;
    promoted.checked = resObj.promoted;
    bot.checked = resObj.bot;
    related.checked = resObj.related;
  });

  for (const item of arrayOfElements) {
    item.addEventListener("change", () => {
      const obj = {
        signin: signin.checked,
        ads: ads.checked,
        promoted: promoted.checked,
        bot: bot.checked,
        related: related.checked,
      };

      chrome.storage.local.set({ obj }).then(() => {
        console.log(
          `Value set: ${obj.signin}, ${obj.ads}, ${obj.promoted}, ${obj.bot}, ${obj.related}`
        );
      });
    });
  }
});
