var Trello = require('node-trello');
var docgen = require("./common.docgen");
const Store = require('electron-store');
const store = new Store();

// store.delete("trello-token");

var package = {
    trello: new Trello('e82234ae3f02e078ae7574da740abb7f', store.get('trello-token')),
    authenticated: false,
    validating: false,
    fetchToken: () => {
        return opener('https://trello.com/1/connect?key=e82234ae3f02e078ae7574da740abb7f&name=Emerge&scope=read,write&expiration=never&response_type=token&return_url=http://localhost:9483/oauthCb');
    },
    fullData: {
        tags: [],
        boards: []
    }
}
module.exports.package = package;

var opener = require('opener');
var express = require('express');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var http = require('http');
var https = require('https');
var app = express();

app.use(bodyParser.json());
app.use(serveStatic(__dirname + "/trello_powerup"));
var fs = require('fs');

//同步读取密钥和签名证书
var options = {
    key: fs.readFileSync(__dirname + '/certs/key.pem'),
    cert: fs.readFileSync(__dirname + '/certs/cert.pem')
}

//powerups
app.post("/pptx/:type", (req, res) => {
    console.log(req.body);
    if (req.params.type == 'list') {
    } else if (req.params.type == 'card') {
        var dt = docgen.parse_card(req.body); //from card to url list..
        docgen.queue(req.body.id, dt);
    }
    res.end();
});

app.get("/", (req, res) => {
    res.send("Server is running").end();
});

app.get("/oauthCb", (req, res) => {
    res.send(`
        Redirecting to EM_WORKFLOW
        <script>
            if(location.href.indexOf("token=") < 0) {
            } else {
                
                var q = location.href.split("token=")[1].trim();
                window.location.href = "/token/" + q;
            }
        </script>
    `).end();
});

app.get("/token/:t", (req, res) => {
    var token = req.params['t'];
    if (!token) {
        return res.end();
    }
    store.set("trello-token", token);
    package.trello = new Trello('e82234ae3f02e078ae7574da740abb7f', store.get('trello-token'));
    validate((r) => {
        if (r) {
            res.send("Success").end();
        } else {
            res.send("Failed").end();
        }
    });
});

function doUpdate() {
    package.trello.get("/1/organizations/5b3ddeb157dfd39616c9e692/tags", {}, (e, s) => {
        if (e) return;
        Vue.set(package.fullData, "tags", s);
        package.trello.get("/1/organizations/5b3ddeb157dfd39616c9e692/boards", { filter: "open", "idTags": true, "tags": true }, (e, s) => {
            if (e) return;
            for (var i = 0; i < s.length; i++) {
                s[i].loading = true;
                s[i].lists = [];
                s[i].cards = [];
                (() => {
                    let b = s[i];
                    package.trello.get("/1/boards/" + b.id, { cards: 'all', card_pluginData: true, lists: "all", "idTags": true, "card_attachments": true }, (e, t) => {
                        console.log(t.lists);
                        Vue.set(b, "lists", t.lists);
                        Vue.set(b, "cards", t.cards);
                        b.loading = false;
                    });
                })();
            }
            Vue.set(package.fullData, "boards", s);
        });

    });

}

function onValidated() {
    // doUpdate();
}

// var t = new Trello("e82234ae3f02e078ae7574da740abb7f", "");
function validate(cb) {
    cb = cb || (() => { });
    if (!store.get('trello-token')) {
        module.exports.package.authenticated = false;
        cb(false);
        return;
    }
    package.validating = true;
    package.trello.get("/1/members/me", function (err, data) {
        package.validating = false;
        if (err) {
            package.authenticated = false;
            cb(false);
        } else {
            console.log(data);
            if (!package.authenticated) {
                onValidated();
            }
            package.authenticated = true;
            cb(true);
        }
    });
}

var httpsServer = https.createServer(options, app);
var httpServer = http.createServer(app);
httpServer.listen(9483);
httpsServer.listen(9484);

validate();
