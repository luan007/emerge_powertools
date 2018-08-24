var router = require("./common.cardRouter");
var feeds = require("./common.feed");

var sanitizeHtml = require('sanitize-html');

var cache = {};
module.exports.data = cache;
module.exports.name = "Feed Service";

function renderFeedEntry(f) {
    var title = (f.meta && f.meta.title) ? f.meta.title : f.name;
    if (f.state == 0) {
        return [{
            bigTitle: "Pending - " + title,
            bigTitle_ico: {
                fas: 1,
                "fa-circle-notch": 1,
            },
            path: "/feeds"
        }];
    } else if (f.state == -1) {
        return [{
            bigTitle: "Error - " + title,
            bigTitle_ico: {
                fas: 1,
                "fa-exclamation-circle": 1
            },
            path: "/feeds"
        }];
    } else if (f.state == 1) {
        return [{
            bigTitle: "Loading - " + title,
            bigTitle_ico: {
                fas: 1,
                "fa-circle-notch": 1,
                "fa-spin": 1
            },
            path: "/feeds"
        }];
    } else if (f.state == 2) {
        var r = [{
            bigTitle: title + " (" + f.list.length + ")",
            bigTitle_ico: {
                far: 1,
                "fa-dot-circle": 1,
            },
            path: "/feeds"
        }];
        var articles = [];
        for (var i = 0; i < f.list.length; i++) {
            articles = articles.concat(renderArticle(f.list[i], f));
        }
        return articles;
    }
}

function renderArticle(a, f) {
    // console.log(a);
    var rawContent = '';
    var lbs = [];
    var res = {
        src: f.meta.title + " / " + a.author,
        src_ico: {
            far: 1,
            "fa-dot-circle": 1,
        },
        labels: lbs,
        raw_title: a.title,
        raw_content: rawContent,
        onclick: () => {
            opener(a.link);
        }
        // img: cache[i].thumbnail
    };

    try {
        var vid = 0;
        var len = 0;
        var THRESHOLD = 300;
        clean = sanitizeHtml(a.description, {
            allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                'pre', 'img', 'iframe'],
            allowedAttributes: {
                a: [],
                // We don't currently allow img itself by default, but this
                // would make sense if we did
                img: ['src']
            },
            transformTags: {
                'blockquote': 'i',
            },
            allowedSchemes: ['http', 'https', 'ftp'],
            exclusiveFilter: function (frame) {
                if (frame.tag == 'iframe') {
                    vid = 1;
                    return true;
                }
                if (len >= THRESHOLD) {
                    return true;
                }
                len += frame.text.length;
            }
        });
        len = 0;
        clean = sanitizeHtml(clean, {
            allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                'pre', 'img'],
            allowedAttributes: {
                a: [],
                // We don't currently allow img itself by default, but this
                // would make sense if we did
                img: ['src']
            },
            textFilter: function (text) {
                len += text.length;
                if (text.length == 0) return "";
                var cut = len - THRESHOLD;
                if (cut <= 0) {
                    return text;
                } else {
                    return text.substring(0, text.length - cut) ? (text.substring(0, text.length - cut) + "...") : "";
                }
            }
        });
        if (vid > 0) {
            lbs.push({
                ico: {
                    fas: 1,
                    "fa-video": 1
                },
                text: "VID"
            });
        }
        res.raw_content = clean;
    }
    catch (e) {
    }
    return [res];
}

router.on("/", (param) => {
    var fd = [];
    for (var i in feeds.package.feeds) {
        var f = feeds.package.feeds[i];
        fd = fd.concat(renderFeedEntry(f));
    }
    return fd;
}, false, "Feed Stream");

router.on("/feeds", (param) => {
    var ret = [];

    // for (var i in cache) {
    //     if (!cache[i]) continue;
    //     if (cache[i].loading) {
    //         ret.push({
    //             bigTitle: (cache[i].type == 'v' ? "VIMEO" : "YOUTUBE") + " Loading..",
    //             bigTitle_ico: cache[i].type == 'v' ? {
    //                 fab: 1,
    //                 "fa-vimeo": 1
    //             } : {
    //                     fab: 1,
    //                     "fa-youtube": 1
    //                 },
    //             more: false
    //         })
    //     } else {
    //         ret.push({
    //             src: (cache[i].type == 'v' ? "VIMEO" : "YOUTUBE"),
    //             src_ico: cache[i].type == 'v' ? {
    //                 fab: 1,
    //                 "fa-vimeo": 1
    //             } : {
    //                     fab: 1,
    //                     "fa-youtube": 1
    //                 },
    //             more: true,
    //             title: cache[i].title,
    //             content: cache[i].description,
    //             img: cache[i].thumbnail
    //         });
    //     }
    // }
    return ret;
}, true);

const { clipboard } = require('electron')
var cw = require('clipboard-watch');
cw.watcher(function () { });