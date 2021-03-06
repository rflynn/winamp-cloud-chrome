
// TODO: separate YouTube-specific logic from media
var media = function(driver, url, filepath, mimetype, title, height, width)
{
    var title_clean = title.replace(/^\s+/,'').replace(/\s+$/,'');
    var artist_guess = YouTube.artist_from_title(title_clean);
    if (artist_guess) {
        title_clean = title_clean.replace(artist_guess + ' - ', '');
    }

    this.driver = driver;
    /* required */
    this.url = url;
    this.filepath = filepath;
    this.mimetype = mimetype;
    this.title = title_clean;
    /* optional */
    this.artist = artist_guess;
    this.album = null;
    this.trackno = null;
    this.height = height;
    this.width = width;
    /* based on metadata fields */
    this.metahash = null;

    this.to_announce = function()
    {
        if (this.title && this.artist && this.album && this.trackno)
        {
            this.metahash = "...";
        }
        if (this.metahash)
        {
            this.idhash = "...";
        }
        var obj = {
            filepath: this.filepath,
            mimetype: this.mimetype,
            title: this.title,
            metahash: this.metahash,
        };
        if (this.artist)  obj.artist  = this.artist;
        if (this.album)   obj.album   = this.album;
        if (this.trackno) obj.trackno = this.trackno;
        if (this.height)  obj.height  = this.height;
        if (this.width)   obj.width   = this.width;
        return obj;
    }
}

var YouTube = function(url, tab, on_media)
{
    // use async bg page and callbacks
    // ref: http://stackoverflow.com/questions/14921500/chrome-extension-getbackgroundpage-returns-null-after-awhile
    chrome.runtime.getBackgroundPage(function(bg){
        var mimetype = bg.CONTENT['mimetype'];
        var h = bg.CONTENT['height'];
        var w = bg.CONTENT['width'];
        var m = new media(YouTube, YouTube.url_canonical(url), YouTube.v(url), mimetype, tab.title.replace(' - YouTube', ''), h, w);
        on_media(m);
    });
}

YouTube.want = function(url)
{
    // looks like our type of url
    return url.match(/^http:\/\/(?:www\.)youtube\.com|youtu\.be\//)
};

YouTube.v = function(url)
{
    // given a YouTube-ish url, construct a canonical one if possible
    // TODO: hmm, should we use a full, canonical url or just the v parameter? on the one hand the full url is "easier" for the base case, but the "v" id gets us more flexibility

    if ((r = /\bv=([a-zA-Z0-9_-]{11})\b/.exec(url)))
    {
        return r[1];
    }

    if ((r = url.match(/^http:\/\/(?:www\.)?youtu.be\/([a-zA-Z0-9_-]{11})$/)))
    {
        return r[1];
    }

    throw "Can't find a video parameter (v=FooBar) in url:" + url;
};

YouTube.url_canonical = function(url)
{
    // canonical
    // http://www.youtube.com/watch?v=5NV6Rdv1a3I
    if (url.match(/^http:\/\/www.youtube.com\/watch\?v=[a-zA-Z0-9_-]{11}$/))
    {
        return url;
    }
    // shortened
    // http://youtu.be/5NV6Rdv1a3I -> http://www.youtube.com/watch?v=5NV6Rdv1a3I&feature=youtu.be
    if ((r = url.match(/^http:\/\/(?:www\.)?youtu.be\/([a-zA-Z0-9_-]{11})$/)))
    {
        return "http://www.youtube.com/watch?v=" + r[1];
    }
    // try extracting from set of params...
    // http://www.youtube.com/watch?NR=1&v=gJr2SVFTI1o&feature=endscreen
    if ((r = /\bv=([a-zA-Z0-9]{8,64})\b/.exec(url)))
    {
        return "http://www.youtube.com/watch?v=" + r[1];
    }

    throw "Can't find a video parameter (v=FooBar) in url:" + url;
};

YouTube.artist_from_title = function(title)
{
    var spl = title.split(' - ');
    if (spl.length > 1) {
        return spl[0];
    }
    return null;
};

//chrome.browserAction.onClicked.addListener(function(tab){

// Run as soon as the document's DOM is ready
document.addEventListener('DOMContentLoaded', function () {

    chrome.tabs.query({'active': true}, function (tabs) {
        var tab = tabs[0];
        var url = tab.url;
        var media;
        if (YouTube.want(url)) {
            media = new YouTube(url, tab, on_media);
        } else {
            alert("Not sure what to do with urls like:" + url);
        }
    });
});

function on_media(media)
{
    // update popup form
    if (media.mimetype) {
        document.getElementById('mimetype').value = media.mimetype;
    }
    if (media.height) {
        document.getElementById('height').value = media.height;
    }
    if (media.width) {
        document.getElementById('width').value = media.width;
    }
    // show url, but we don't really use it
    document.getElementById('url').value = media.url;
    document.getElementById('filepath').value = media.filepath;
    document.getElementById('title').value = media.title;
    document.getElementById('artist').value = media.artist;
}
