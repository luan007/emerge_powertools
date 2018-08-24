var youtubedl = require('youtube-dl');

module.exports.fetch = function (s, cb) {
    youtubedl.getInfo(s, ['--proxy=socks5://127.0.0.1:1086'], { maxBuffer: 1000 * 1024 }, cb);
}