var package = {
    deck_to_form: {}
}
module.exports.package = package;
var video = require("./common.youtubedl");

module.exports.markdown_to_pages = function (txt) {
    return [];
}

module.exports.parse_card = function (card) {
    var contents = [];
    contents.push({
        type: "title",
        content: card.name
    });
    if(card.desc) {
        var md = module.exports.markdown_to_pages(card.desc);
        if (md.length > 0) {
            contents = contents.concat(md);
        } else {
            contents.push({
                type: "desc",
                content: card.desc
            });
        }
    }
    return contents;
}

module.exports.parse_url = function (url) {
}

module.exports.queue = function (id, data) {
    if (package.deck_to_form[id]) {
        package.deck_to_form[id].removed = true;
    }
    package.deck_to_form[id] = data;
    package.deck_to_form[id].creation = Date.now();
    console.log(id, data);
}