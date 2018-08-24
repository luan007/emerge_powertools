var router = require("./common.cardRouter");
var feeds = require("./common.feed");

var cache = {};
module.exports.data = cache;
module.exports.name = "video";

router.on("/", (param) => {
    return [{
        bigTitle: "Feeds",
        bigTitle_ico: {
            fas: 1,
            "fa-eye": 1
        },
        more: true,
        path: "/feeds"
    }];
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