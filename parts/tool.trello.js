var trel = require("./common.trello")
var router = require("./common.cardRouter");
var opener = require('opener');

var cache = {
    package: trel.package
};
module.exports.data = cache;
module.exports.name = "trello";


function oneCard(card) {
    if (!card) {
        return [];
    }
    dt = [];
    console.log(card);
    dt.push({
        src: "card name",
        title: card.name,
        src_ico: {
            fab: 1,
            "fa-trello": 1
        }
    });

    dt.push({
        src: "card description",
        content: card.desc,
        src_ico: {
            fab: 1,
            "fa-trello": 1
        },
        more: true
    });

    for(var i = 0; i < card.attachments.length; i++) {

        dt.push({
            src: "card attachment",
            content: card.attachments[i].name,
            src_ico: {
                fas: 1,
                "fa-paperclip": 1
            },
            more: true
        });
    
    }
    //https://trello.com/c/h0lbAtid/1-%E8%AF%B7%E5%8B%BF%E4%BD%BF%E7%94%A8
    // for (var i = 0; i < cards.length; i++) {
    //     ((i) => {
    //         dt.push({
    //             src: "card",
    //             title: cards[i].name,
    //             content: cards[i].desc,
    //             src_ico: {
    //                 fab: 1,
    //                 "fa-trello": 1
    //             },
    //             more: true,
    //             onclick: function () {
    //                 opener(cards[i].shortUrl);
    //             }
    //         });
    //     })(i);
    // }
    return dt;
}

function listOfCards(cards) {
    cards = cards || [];
    cards = cards.filter((c) => {
        return !c.closed;
    });
    if (!cards || cards.length == 0) {
        return [];
    }
    var dt = []
    // console.log(cards);
    for (var i = 0; i < cards.length; i++) {
        ((i) => {
            var lb = [];
            if(cards[i].attachments.length > 0) {
                lb.push({
                    ico: {
                        fas: 1,
                        "fa-paperclip": 1
                    },
                    text: "attached " + cards[i].attachments.length
                });
            }
            dt.push({
                src: "card",
                title: cards[i].name,
                content: cards[i].desc,
                labels: lb,
                src_ico: {
                    fab: 1,
                    "fa-trello": 1
                },
                more: true,
                // onclick: function () {
                //     opener(cards[i].shortUrl);
                // }
                path: "/trello/" + cards[i].id
            });
        })(i);
    }
    return dt;
}

function listOflists(lists) {
    lists = lists || [];
    lists = lists.filter((c) => {
        return !c.closed;
    });
    if (!lists || lists.length == 0) {
        return [];
    }
    var dt = []
    for (var i = 0; i < lists.length; i++) {
        dt.push({
            src: "list",
            title: lists[i].name,
            src_ico: {
                fab: 1,
                "fa-trello": 1
            },
            more: true,
            path: "/trello/" + lists[i].id
        });
    }
    return dt;
}

function listOfBoards(boards) {
    boards = boards || [];
    boards = boards.filter((c) => {
        return !c.closed;
    });
    if (!boards || boards.length == 0) {
        return [];
    }
    var dt = []
    for (var i = 0; i < boards.length; i++) {
        dt.push({
            src: "board",
            title: boards[i].name,
            src_ico: {
                fab: 1,
                "fa-trello": 1
            },
            more: true,
            path: "/trello/" + boards[i].id
        });
    }
    return dt;
}

function collections() {
    var dt = []
    for (var cat = 0; cat < trel.package.fullData.tags.length; cat++) {
        dt.push({
            src: "collection",
            title: trel.package.fullData.tags[cat].name,
            src_ico: {
                fab: 1,
                "fa-trello": 1
            },
            more: true,
            path: "/trello/" + trel.package.fullData.tags[cat].id
        });
    }
    return dt;
}

function rootTrello() {
    return [{
        bigTitle: "Emerge Trello",
        bigTitle_ico: {
            fab: 1,
            "fa-chrome": 1
        },
        more: true,
        onclick: () => {
            opener("https://trello.com/0em");
        }
    }, {
        bigTitle: "EMERGE / COLLECTIONS",
        bigTitle_ico: {
            fab: 1,
            "fa-trello": 1
        },
        more: true,
        path: "/trello/collections"
    }];
}

// router.on("/trello/collections", collections, true);
// router.on("/trello/:id", (params) => {
//     var tag = trel.package.fullData.tags.filter((c) => {
//         return c.id == params.id;
//     });
//     if (tag.length > 0) {
//         var tagId = tag[0].id;
//         var boards = trel.package.fullData.boards.filter((c) => {
//             return c.idTags.indexOf(tagId) >= 0;
//         });
//         return listOfBoards(boards);
//     }
//     for (var i = 0; i < trel.package.fullData.boards.length; i++) {
//         if (trel.package.fullData.boards[i].id == params.id) {
//             return listOflists(trel.package.fullData.boards[i].lists);
//         }
//         for (var j = 0; j < trel.package.fullData.boards[i].lists.length; j++) {
//             if (trel.package.fullData.boards[i].lists[j].id == params.id) {
//                 return listOfCards(trel.package.fullData.boards[i].cards.filter((c) => {
//                     return c.idList == params.id;
//                 }));
//             }
//             for (var q = 0; q < trel.package.fullData.boards[i].cards.length; q++) {
//                 if (trel.package.fullData.boards[i].cards[q].id == params.id) {
//                     return oneCard(trel.package.fullData.boards[i].cards[q]);
//                 }
//             }
//         }
//     }
//     return [];
// }, true);
// router.on("/trello", rootTrello, true);

router.on("/", (param) => {
    var dt = [{
        bigTitle: "Emerge Trello",
        bigTitle_ico: {
            fab: 1,
            "fa-chrome": 1
        },
        more: true,
        onclick: () => {
            opener("https://trello.com/0em");
        }
    }
    ];
    if (trel.package.validating) {
        return dt.concat([{
            src: "Trello",
            src_ico: {
                fab: 1,
                "fa-trello": 1
            },
            more: false,
            title: "Validating.."
        }]);
    }
    else if (!cache.package.authenticated) {
        return dt.concat([{
            src: "Trello",
            src_ico: {
                fab: 1,
                "fa-trello": 1
            },
            more: true,
            title: "Please Login",
            onclick: () => {
                cache.package.fetchToken();
            }
        }]);
    } else {
        return dt.concat([
        //     { //snapshot
        //     bigTitle: "EMERGE / Collections",
        //     bigTitle_ico: {
        //         fab: 1,
        //         "fa-trello": 1
        //     },
        //     more: true,
        //     path: "/trello/collections"
        // }
    ]);
    }
}, false, "Trello Service");

router.on("/trello", (param) => {
    var ret = [];
    return ret;
});
