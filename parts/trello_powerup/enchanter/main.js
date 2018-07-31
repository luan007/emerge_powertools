// https://github.com/yanatan16/nanoajax
!function (t, e) { function n(t) { return t && e.XDomainRequest && !/MSIE 1/.test(navigator.userAgent) ? new XDomainRequest : e.XMLHttpRequest ? new XMLHttpRequest : void 0 } function o(t, e, n) { t[e] = t[e] || n } var r = ["responseType", "withCredentials", "timeout", "onprogress"]; t.ajax = function (t, a) { function s(t, e) { return function () { c || (a(void 0 === f.status ? t : f.status, 0 === f.status ? "Error" : f.response || f.responseText || e, f), c = !0) } } var u = t.headers || {}, i = t.body, d = t.method || (i ? "POST" : "GET"), c = !1, f = n(t.cors); f.open(d, t.url, !0); var l = f.onload = s(200); f.onreadystatechange = function () { 4 === f.readyState && l() }, f.onerror = s(null, "Error"), f.ontimeout = s(null, "Timeout"), f.onabort = s(null, "Abort"), i && (o(u, "X-Requested-With", "XMLHttpRequest"), e.FormData && i instanceof e.FormData || o(u, "Content-Type", "application/x-www-form-urlencoded")); for (var p, m = 0, v = r.length; v > m; m++)p = r[m], void 0 !== t[p] && (f[p] = t[p]); for (var p in u) f.setRequestHeader(p, u[p]); return f.send(i), f }, e.nanoajax = t }({}, function () { return this }());

window.root = "https://localhost:9484/";

var GRAY_ICON = root + 'enchanter/icons/icon-em.svg';

window.Trello.authorize({
    type: 'popup',
    name: 'EMERGE_WORK_FLOW',
    scope: {
        read: 'true',
        write: 'true'
    },
    expiration: 'never',
    success: function () {
        console.log("Auth Good");
    },
    error: function () {
        console.log("Bad");
    }
});

window.TrelloPowerUp.initialize({
    'list-actions': function (t) {
        // return t.list('name', 'id')
        //     .then(function (list) {
        return [{
            text: "Export",
            callback: function (t) {
                // Trello will call this if the user clicks on this action
                // we could for example open a new popover...
                t.popup({
                    title: 'Select Export Type',
                    items: ['Deck'].map(function (code) {
                        return {
                            text: code,
                            callback: function (t) {
                                t.list('all').then((d) => {
                                    var x = new XMLHttpRequest();
                                    x.open("POST", root + "pptx/list", true);
                                    x.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                    x.send(JSON.stringify(s));
                                });
                                t.closePopup();
                            }
                        };
                    })
                })
            }
        }];
        // });
    },
    'card-buttons': function (t, opts) {
        return [{
            icon: GRAY_ICON,
            text: 'Export',
            callback: function (t) {
                t.popup({
                    title: 'Select Export Type',
                    items: ['Deck'].map(function (code) {
                        return {
                            text: code,
                            callback: function (t) {
                                t.card('all').then((d) => {
                                    console.log("getting actions...");
                                    Trello.cards.get(d.id, {
                                        fields: "all",
                                        actions: "all",
                                        attachments: true,
                                        checklists: "all",
                                    }, (s) => {
                                        alert("Your request is being processed")
                                        var x = new XMLHttpRequest();
                                        x.open("POST", root + "pptx/card", true);
                                        x.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                        x.send(JSON.stringify(s));
                                    });
                                });
                                t.closePopup();
                            }
                        };
                    })
                })
            },
            condition: 'edit'
        }];
    }
});