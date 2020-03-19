console.log("Content script baby");
chrome.runtime.sendMessage({type:"loaded"},
    function(response) {
        console.log("They responded?");
    }
);

chrome.runtime.onMessage.addListener(function(){
    console.log("Running the request of PiP");
    document.getElementById("content-video-player").requestPictureInPicture();
});
