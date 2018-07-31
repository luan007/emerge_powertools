var router = require("./common.cardRouter");

var cache = {};
module.exports.data = cache;
module.exports.name = "docgen";



router.on("/", (param) => {
    return [{
        src: "Document Generator",
        src_ico: {
            fas: 1,
            "fa-circle-notch": 1,
            "fa-spin": 1
        },
        title: "Deck is being processed",
        content: "Trello",
        more: false,
        actions: [
            {
                type: "button",
                text: "Download",
                ico: {
                    fas: 1,
                    "fa-download": 1
                }
            }
        ],
        operators: [
            {
                color: "#ff0000",
                text: "Download",
                ico: {
                    fas: 1,
                    "fa-download": 1
                }
            }
        ]
    }];
}, false, "Document Generator");
