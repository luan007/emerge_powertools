const Route = require('route-parser');

global.Routing = [];

module.exports.on = function (path, immediateCb, exclusive, combinedName) {
    var r = new Route(path);
    Routing.push({
        route: r,
        cb: immediateCb,
        exclusive: exclusive,
        combinedName: combinedName || "Module"
    });
}

module.exports.route = function (path) {
    var data = [];
    for (var i = 0; i < global.Routing.length; i++) {
        var m = Routing[i].route.match(path);
        if (m) {
            var dt = Routing[i].cb(m);
            if(!dt) continue;
            dt.name = Routing[i].combinedName;
            if (Routing[i].exclusive) {
                return [dt];
            } else {
                data = data || [];
                data.push(dt);
            }
        }
    }
    return data;
}