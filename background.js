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

chrome.pageAction.onClicked.addListener(function(tab) {
    const framesToDo = communicatingFrames.filter(frameInfo => frameInfo.tabId == tab.id);
    console.log("Clicked");
    framesToDo.forEach(frameToDo => chrome.tabs.sendMessage(tab.id, {
        type: 'toggle',
        selector: frameToDo.selector
    }, {
        frameId: frameToDo.frameId
    }));
});

chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    const domain = new URL(sender.url).hostname;
    if (message.type == "loaded" && domain) { //TODO make this refer to the video loading
        console.log(domain);
        const snapshot = (await db.ref("/scrapers/" + domain.replace(/\./g, ",") + "/css").once("value")).val();
        console.log(snapshot);
        if (!snapshot) return;
        communicatingFrames.push({
            tabId: sender.tab.id,
            frameId: sender.frameId,
            selector: snapshot,
        });
        chrome.pageAction.show(sender.tab.id);
    }
});

window.setForDomain = function(domain, selector) {
    firebase.database().ref('scrapers/' + sanitize(domain)).set({
        css:selector
    });
}
