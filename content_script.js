
var meta = function(sel) {
    var m = document.querySelectorAll(sel);
    if (m) {
        return m[0].getAttribute('content') || null;
    }
    return null;
};


function scrape_youtube() {
    var title = document.querySelector('title').innerText.replace(/^\s+/,'').replace(/\s+$/,'');
    var t = {
        title: null,
        mimetype: meta('meta[property="og:video:type"]'),
        duration: null,
        height: meta('meta[property="og:video:height"]'),
        width: meta('meta[property="og:video:width"]'),
        image: null
    };
    console.log(t);
    return t;
}

function scrape_myspace_video() {
    var dur = meta('meta[property="video:duration"]');
    var video = document.querySelector('#msVideoPlayer embed');
    var t = {
        title: meta('meta[property="og:title"]').replace(/^\s+/,'').replace(/\s+$/,'').replace(/ - Myspace Video$/,''),
        filepath: document.URL.match(/\/([0-9]{8,10})$/)[1],
        mimetype: video ? video.type : null,
        duration: dur === null ? null : dur * 1000,
        height: video ? video.height : null,
        width: video ? video.width : null,
        image: meta('meta[property="og:image"]')
    };
    console.log(t);
    return t;
}

function scrape_myspace_music() {
    var title = document.querySelector('title').innerText.replace(/^\s+/,'').replace(/\s+$/,'').split(/ \| /)[0];
    var dur = meta('meta[property="music:duration"]');
    var video = document.querySelector('#msVideoPlayer embed');
    var t = {
        title: title.split(/ by /)[0],
        artist: title.split(/ by /)[1],
        //mimetype: video ? video.type : null,
        duration: dur === null ? null : dur * 1000,
        filepath: document.URL.match(/-([0-9]{8,10})$/)[1],
        disc: meta('meta[property="music:album:disc"]'),
        trackno: meta('meta[property="music:album:track"]'),
        height: null,
        width: null,
        image: meta('meta[property="og:image"]')
    };
    console.log(t);
    return t;
}

function scrape()
{
    var url = document.URL;
    if (/^http:\/\/www\.youtube\.com\/.*\bv=/.test(url)) {
        return scrape_youtube();
    } else if (/^http:\/\/www\.myspace\.com\/video\//.test(url)) {
        return scrape_myspace_video();
    } else if (/^http:\/\/www\.myspace\.com\/[^\/]+\/music\//.test(url)) {
        return scrape_myspace_music();
    }
    throw "scrape couldn't handle url:"+url;
}

scrape();

// wait for background to ask us for content
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Return nothing to let the connection be cleaned up.
    //chrome.tabs.sendMessage(sender.tab.id, {});
    sendResponse(scrape());
});
