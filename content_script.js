
var meta = function(sel) {
    var m = document.querySelectorAll(sel);
    if (m) {
        return m[0].getAttribute('content') || null;
    }
    return null;
};

if (/^http:\/\/www\.youtube\.com\/.*\bv=/.test(document.URL)) {
    var payload = {
        mimetype: meta('meta[property="og:video:type"]'),
        height: meta('meta[property="og:video:height"]'),
        width: meta('meta[property="og:video:width"]')
    };
    chrome.runtime.sendMessage(payload, function(response){});
}

