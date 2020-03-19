let communicatingFrames = [];

chrome.pageAction.onClicked.addListener(function(tab) {
    //TODO Tell iframe in current tab to toggle PiP
    const frameToDo=communicatingFrames.find(frameInfo=>frameInfo.tabId==tab.id);
    if(frameToDo){
        chrome.tabs.sendMessage(tab.id,{type:'toggle'},{frameId:frameToDo.frameId});
    }
});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    if(message.type=="loaded"){ //TODO make this refer to the video loading
        communicatingFrames.push({tabId:sender.tab.id,frameId:sender.frameId});
        chrome.pageAction.show(sender.tab.id);
    }
});
