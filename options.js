const domainInput=document.querySelector("input[name=domain]");
const selectorInput=document.querySelector("textarea[name=selector]");
const submit=document.querySelector("button");
const bkg=chrome.extension.getBackgroundPage();
submit.addEventListener("click",()=>(bkg.setForDomain(domainInput.value,selectorInput.value),alert("Set up")));