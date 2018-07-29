var trel = require("./common.trello")
var router = require("./common.cardRouter");
var opener = require('opener');

var cache = {
    package: trel.package
};
module.exports.data = cache;
module.exports.name = "trello";

router.on("/", (param) => {
    if (!cache.package.authenticated) {
        // return [{
        //     bigTitle: "Trello",
        //     bigTitle_ico: {
        //         fab: 1,
        //         "fa-trello": 1
        //     },
        //     more: true,
        //     onclick: () => {
        //         cache.package.fetchToken();
        //     }
        // }];

        return [{
            src: "Trello",
            src_ico: {
                fab: 1,
                "fa-trello": 1
            },
            more: true,
            content: "Login Needed",
            onclick: () => {
                cache.package.fetchToken();
            }
        }];

    } else {
        return [{
            bigTitle: "EMERGE",
            bigTitle_ico: {
                fab: 1,
                "fa-trello": 1
            },
            more: true,
            onclick: () => {
                // cache.package.fetchToken();
            }
        }];
    }
});


router.on("/trello", (param) => {
    var ret = [];

    return ret;
});
