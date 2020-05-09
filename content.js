chrome.runtime.sendMessage({type:"loaded"});
let videoEl;

chrome.runtime.onMessage.addListener(function({type,selector}){
    console.log(selector);
    const el=document.querySelector(selector);
    if(el){
        if(el.requestPictureInPicture)
            el.requestPictureInPicture();
        else if(el.captureStream){
            videoEl=videoEl||document.createElement("video");
            const srcObject=el.captureStream(30);
            videoEl.srcObject=srcObject;
            videoEl.play();
            videoEl.requestPictureInPicture();
        }
        
    }
});
