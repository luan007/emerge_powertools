const Route = require('route-parser');

global.Routing = [];

module.exports.on = function (path, immediateCb, exclusive) {
    var r = new Route(path);
    Routing.push({
        route: r,
        cb: immediateCb,
        exclusive: exclusive
    });
}

module.exports.route = function (path) {
    var data = [];
    for (var i = 0; i < global.Routing.length; i++) {
        var m = Routing[i].route.match(path);
        if (m) {
            var dt = Routing[i].cb(m);
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