chrome.runtime.sendMessage({
    type: "loaded"
});
let videoEl;
let chosenEl;

chrome.runtime.onMessage.addListener(async function({
    type,
    selector
}, sender, reply) {
    if (type == "findEls") {
        const els = [...document.querySelectorAll(selector)];
        const el = (els.length ? (els.length == 1 ? els[0] : ((els => els.length == 1 ? els : els.filter(el => el.muted===false))(els.filter(el => !el.paused))[0] || els[0])) : null);
        chosenEl = el;
        reply({
            type: "el",
            hasSound:el.muted===false,
            isDefinitelyPlaying:!el.paused,
        });
    } else if (type=="runEl") {
        const el=chosenEl;
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
