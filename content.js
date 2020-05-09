chrome.runtime.sendMessage({
    type: "loaded"
});
let videoEl;

chrome.runtime.onMessage.addListener(function({
    type,
    selector
}) {
    const els = [...document.querySelectorAll(selector)];
    const el = (els.length? (els.length == 1 ? els[0] : ((els=>els.length==1?els:els.filter(el => !el.muted))(els.filter(el => !el.paused))?.[0] || els[0])):null);
    if (el) {
        if (el.requestPictureInPicture)
            el.requestPictureInPicture();
        else if (el.captureStream) {
            videoEl = videoEl || document.createElement("video");
            const srcObject = el.captureStream(30);
            videoEl.srcObject = srcObject;
            videoEl.play();
            videoEl.requestPictureInPicture();
        }

    }
});
