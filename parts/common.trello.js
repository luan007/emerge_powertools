module.exports.authroize = () => {
    window.Trello.authorize({
        type: 'popup',
        name: 'SINGULARITY\n(EM_INTERNAL)',
        scope: {
            read: 'true',
            write: 'true'
        },
        expiration: 'never',
        success: function () {
            alert("authroized");
            console.log("Auth Good");
            // Trello.get("organizations/studioemerge/boards", { filter: "open" }, (s) => {
            //     for (var i = 0; i < s.length; i++) {
            //         Trello.get("boards/" + s[i].id, { cards: 'all', card_pluginData: true, lists: "all" }, (t) => {
            //             console.log(t);
            //         });
            //     }
            // });
        },
        error: function () {
            console.log("Bad");
        }
    });
}