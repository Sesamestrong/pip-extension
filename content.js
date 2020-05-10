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
        const el = runConstraints(mediaElementRules, els);
        if (!el) return reply();
        chosenEl = el;
        reply({
            type: "el",
            muted: el.muted,
            paused: el.paused,
            requestPictureInPicture:!!el.requestPictureInPicture,
        });
    } else if (type == "runEl" && chosenEl) {
        const el = chosenEl;
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
