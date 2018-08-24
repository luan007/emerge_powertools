var video = require("./common.youtubedl");
var router = require("./common.cardRouter");


var cache = {};
module.exports.data = cache;
module.exports.name = "video";

function getVideoCount() {
    var j = 0;
    for(var i in cache) {
        if(cache[i]) {
            j++;
        }
    }
    return j;
}

router.on("/", (param) => {
    if (getVideoCount() > 0) {
        return [{
            bigTitle: "Videos " + (getVideoCount() ? ("(" + getVideoCount() + ")") : ""),
            bigTitle_ico: {
                fas: 1,
                "fa-video": 1
            },
            more: true,
            path: "/video"
        }];
    } else {
        return undefined;
    }
}, false, "Clipboarded Videos");

router.on("/video", (param) => {
    var ret = [];
    for (var i in cache) {
        if (!cache[i]) continue;
        if (cache[i].loading) {
            ret.push({
                bigTitle: (cache[i].type == 'v' ? "VIMEO" : "YOUTUBE") + " Loading..",
                bigTitle_ico: cache[i].type == 'v' ? {
                    fab: 1,
                    "fa-vimeo": 1
                } : {
                        fab: 1,
                        "fa-youtube": 1
                    },
                more: false
            })
        } else {
            ret.push({
                src: (cache[i].type == 'v' ? "VIMEO" : "YOUTUBE"),
                src_ico: cache[i].type == 'v' ? {
                    fab: 1,
                    "fa-vimeo": 1
                } : {
                        fab: 1,
                        "fa-youtube": 1
                    },
                more: true,
                title: cache[i].title,
                content: cache[i].description,
                img: cache[i].thumbnail
            });
        }
    }
    return ret;
}, true);

const { clipboard } = require('electron')
var cw = require('clipboard-watch');
cw.watcher(function () {
    var s = clipboard.readText();
    if (!(s.indexOf("vimeo") >= 0 || s.indexOf("youtube") >= 0)) {
        return;
    }
    if (cache[s]) {
        return;
    } else {
        Vue.set(cache, s, { loading: 1, type: s.indexOf("vimeo") >= 0 ? "v" : "y" })
        tick();
        video.fetch(s, function (err, info) {
            if (err) {
                cache[s] = undefined;
                return;
            }
            info.type = s.indexOf("vimeo") >= 0 ? "v" : "y";
            Vue.set(cache, s, info);
            tick();
            // console.log('id:', info.id);
            // console.log('title:', info.title);
            // console.log('url:', info.url);
            // console.log('thumbnail:', info.thumbnail);
            // console.log('description:', info.description);
            // console.log('filename:', info._filename);
            // console.log('format id:', info.format_id);
            // cache[s] = info;
        });
    }
});
