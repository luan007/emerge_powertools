var router = require("./common.cardRouter");
var em_trello = require("./common.trello");
var opener = require('opener');

// em_trello.authroize();

router.on("/", (param) => {
    // return [{
    //     bigTitle: "Open Trello",
    //     bigTitle_ico: {
    //         fab: 1,
    //         "fa-trello": 1
    //     },
    //     more: true,
    //     onclick: () => {
    //         opener("https://trello.com/0em")
    //     }
    // }];
});

var plugins = [
    require("./tool.vimeo"),
    require("./tool.docgen"),
    require("./tool.trello"),
];

function generatePPT(debs) {
    var pptx = new PptxGenJS();

    var title = pptx.addNewSlide();
    title.addText("/" + debs.name, {
        x: "4%", y: "48%", fontSize: 20, fontFace: 'Nexa Bold', color: '333333'
    });
    title.addText('Generated from /c/' + debs.shortLink + " # Emerge Confidential", {
        x: "4%", y: "53%", fontSize: 10, fontFace: 'PingFang SC Bold', color: 'aaaaaa'
    });

    var desc = pptx.addNewSlide();
    desc.addText("/" + debs.name, {
        x: "4%", y: "15%", fontSize: 15, fontFace: 'Nexa Bold', color: '333333'
    });

    desc.addText(debs.desc || "[ No Description Available. ]", {
        x: "4%", y: "43%", w: "60%", lineSpacing: 23, fontSize: 15, fontFace: 'PingFang SC Lighter', color: '999999'
    });

    for (var i = 0; i < debs.attachments.length; i++) {
        var a = debs.attachments[i];
        var att = pptx.addNewSlide();

        att.addText("/" + debs.name, {
            x: "4%", y: "15%", fontSize: 15, fontFace: 'Nexa Bold', color: 'aaaaaa'
        });
        att.addText("" + a.name, {
            x: "4%", y: "20%", fontSize: 10, fontFace: 'Nexa Bold', color: '333333'
        });

        if (a.url.endsWith(".jpg")) {
            att.addImage({
                path: a.url,
                sizing: { type: 'contain', w: 2, h: 2 },
                x: "50%", y: "50%", w: 6, h: 4
            })
        }

        att.addText('Generated from /c/' + debs.shortLink + " # Emerge Confidential", {
            x: "0%", y: "94%", fontSize: 8, fontFace: 'PingFang SC', color: 'aaaaaa'
        });
        att.addText('EMERGE 2018', {
            x: "90%", y: "94%", fontSize: 8, fontFace: 'Nexa Bold', color: '888888'
        });
    }
    pptx.save('Sample Presentation');
}

var data = {
    context: {
        str: ""
    },
    path: "/",
    prev_path: [],
    preview: "",
    plugins: {}
};

for (var i = 0; i < plugins.length; i++) {
    data.plugins[plugins[i].name] = (plugins[i].data);
}

console.log(data)

function pushState(path) {
    var prev = data.path;
    data.path = path;
    if(path == '/') {
        while(data.prev_path.length) data.prev_path.pop();
        return;
    }
    if(data.prev_path[data.prev_path.length - 1] != prev) {
        data.prev_path.push(prev);
        console.log(data.prev_path);
    }
}

window.vm = new Vue({
    el: '#app',
    data: data,
    computed: {
        paths: function() {
            var p = data.path.split("/");
            var cache = "";
            var d = [{
                label: "home",
                path: "/"
            }];
            for(var i = 0; i < p.length; i++){
                if(!p[i]) continue;
                cache += "/" + p[i];
                d.push({
                    label: p[i],
                    path: cache
                });
            }
            return d;
        }
    },
    methods: {
        pushState: pushState,
        getCards: function () {
            return router.route(data.preview || data.path);
        },
        clickOnCard: function (card) {
            if (card.onclick) {
                return card.onclick();
            } else if (card.path) {
                pushState(card.path);
            }
        }
    },
})

const { clipboard } = require('electron')
var cw = require('clipboard-watch');
//start watcher clipboard change
cw.watcher(function () {
    data.context.str = clipboard.readText();
});