// Firebase

var firebaseConfig = {
    apiKey: "AIzaSyAte_TSENBmis2rH4UwUI3OtADJB1xcBr8",
    authDomain: "picture-in-picture-8c31d.firebaseapp.com",
    databaseURL: "https://picture-in-picture-8c31d.firebaseio.com",
    projectId: "picture-in-picture-8c31d",
    storageBucket: "picture-in-picture-8c31d.appspot.com",
    messagingSenderId: "703369579660",
    appId: "1:703369579660:web:a44689e8bd731bf4abffa9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

let communicatingFrames = [];


chrome.pageAction.onClicked.addListener(async function(tab) {
    const framesToDo = communicatingFrames.filter(frameInfo => frameInfo.tabId == tab.id);
    const els = (await Promise.all(framesToDo.map(frameToDo => new Promise((resolve, reject) => (chrome.tabs.sendMessage(tab.id, {
        type: 'findEls',
        selector: frameToDo.selector
    }, {
        frameId: frameToDo.frameId
    }, ({
        type,
        hasSound,
        isDefinitelyPlaying
    }) => resolve({
        type,
        hasSound,
        isDefinitelyPlaying,
        frameId: frameToDo.frameId
    }))))))).filter(el => el);
    const el = (els.length ? (els.length == 1 ? els[0] : ((els => els.length == 1 ? els : els.filter(el => el.hasSound))(els.filter(el => el.isDefinitelyPlaying))[0] || els[0])) : null)
    chrome.tabs.sendMessage(tab.id, {
        type: 'runEl'
    });
});

chrome.tabs.onUpdated.addListener(function(tabId) {
    chrome.pageAction.show(tabId);
});

chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    const domain = new URL(sender.url).hostname;

    if (message.type == "loaded" && domain) { //TODO make this refer to the video loading
        const snapshot = (await db.ref("/scrapers/" + domain.replace(/\./g, ",") + "/css").once("value")).val();
        if (!snapshot) return;
        communicatingFrames.push({
            tabId: sender.tab.id,
            frameId: sender.frameId,
            selector: snapshot,
        });
        console.log("Enabling", domain);
        setOnSite(sender.tab.id, true);
    }
});


function setOnSite(tabId, isOn) {
    chrome.pageAction.setIcon({
        tabId,
        path: "images/" + (isOn ? "enabled" : "disabled") + "32.png"
    });
    chrome.pageAction.setPopup({
        tabId,
        popup: isOn ? "" : "popup.html"
    });
}

window.setForDomain = function(domain, selector) {
    sanDomain = domain.replace(/\./g, ",");
    db.ref('/scrapers/' + sanDomain).set({
        css: selector
    });
}
