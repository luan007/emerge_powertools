(function () {
    window.parse_rss = function (url, callback) {
        var FeedParser, domain, options, request, rss;
        FeedParser = require('feedparser');
        request = require('request');
        options = {
            normalize: false,
            addmeta: true,
            feedurl: url
        };
        rss = [];
        domain = require('domain').create();
        domain.on('error', function (e) {
            return callback(e, null);
        });
        return domain.run(function () {

            /* Module Initialize */
            var feedParser, req;
            req = request(url);
            feedParser = new FeedParser([options]);

            /* REQUEST */
            req.on('error', function (err) {
                return callback(err, null);
            });
            req.on('response', function (res) {
                var stream;
                stream = this;
                if (res.statusCode !== 200) {
                    return this.emit('error', new Error('Bad status code'));
                }
                return stream.pipe(feedParser);
            });

            /* FEEDPARSER */
            feedParser.on('error', function (err) {
                return callback(err, null);
            });
            feedParser.on('readable', function () {
                var item, stream;
                stream = this;
                if (item = stream.read()) {
                    return rss.push(item);
                }
            });
            return feedParser.on('end', function () {
                if (rss.length === 0) {
                    return callback('no articles');
                }
                return callback(null, rss, this.meta);
            });
        });
    };
})();

var parse = parse_rss;

var package = {
    feeds: [
        {
            name: "futurism",
            url: "https://futurism.com/feed",
            meta: {},
            list: [],
            state: 0
        }
    ],
}

function load() {
    for (var i in package.feeds) {
        var cur = package.feeds[i];
        if (cur.state <= 0) {
            __load(cur);
        }
    }
}

function __load(pkg) {
    let url = pkg.url;
    pkg.state = 1;
    parse(url, (err, res, meta) => {
        pkg.state = err ? -1 : 2;
        pkg.list = res;
        pkg.meta = meta;
        Vue.set(package, "feeds", package.feeds);
        vm.$forceUpdate()
    });
}


load();

module.exports.package = package;