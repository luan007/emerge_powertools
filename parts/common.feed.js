var parse = require('parse-rss');

var package = {
    feeds: [
        {
            url: "https://futurism.com/search/test/feed/rss2/",
            list: [],
            state: 0
        }
    ],
}

function load() {
    for(var i in package.feeds) {
        var cur = package.feeds[i];
        if(cur.state == 0) {
            __load(cur);
        }
    }
}

function __load(pkg) {
    let url = pkg.url;
    pkg.state = 1;
    parse(url, (err, res) => {
        pkg.state = err ? 0 : 2;
        pkg.list = res;
        console.log("loaded.");
        Vue.set(package, "feeds", package.feeds);
        vm.$forceUpdate()
    });
}


load();

module.exports.package = package;