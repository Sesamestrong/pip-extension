const domainInput = document.querySelector("input[name=domain]");
const selectorInput = document.querySelector("textarea[name=selector]");
const submit = document.querySelector("button");
const bkg = chrome.extension.getBackgroundPage();
chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
}, ([tab]) => {
    domainInput.value = new URL(tab.url).hostname
});
submit.addEventListener("click", () => (bkg.setForDomain(domainInput.value, selectorInput.value), alert("Set up")));
