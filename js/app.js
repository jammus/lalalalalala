define(function() {

    var App = function() {

        var that = this,
            subscriptions = { };

        that.subscribe = function(name, callback) {
            if (typeof subscriptions[name] === 'undefined') {
                subscriptions[name] = [ ];
            }
            subscriptions[name].push(callback);
        };

        that.publish = function(name, data) {
            var subscribers = subscriptions[name];
            if (! subscribers) {
                return;
            }

            for (var i = 0, len = subscribers.length; i < len; i++) {
                subscribers[i](data);
            }
        };
    };

    return App;

});
