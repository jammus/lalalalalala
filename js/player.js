define(['jquery'], function($) {
    var Player = function(app) {
        var that = this;

        that.play = function(artist, trackName) {
            var track = window.tomahkAPI.Track(trackName, artist, {
                handlers: {
                    onplayable: function() {
                        track.play();
                    },
                    ontimeupdate: function(timeupdate) {
                        app.publish('track.timeupdate', timeupdate.currentTime);
                    }
                }
            });
            $('.player').append(track.render());
        };
    };

    return Player;
});
