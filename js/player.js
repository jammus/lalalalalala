define(['jquery'], function($) {
    var Player = function(app) {
        var that = this;
        var playing = false;

        that.play = function(artist, trackName) {
            var track = window.tomahkAPI.Track(trackName, artist, {
                disabledResolvers: [ "Youtube", "Exfm" ],
                handlers: {
                    onresolved: function() {
                        if (playing) {
                            return;
                        }
                        playing = true;
                        track.play();
                    },
                    ontimeupdate: function(timeupdate) {
                        app.publish('track.timeupdate', timeupdate.currentTime * 1000);
                    }
                }
            });
            $('.player').append(track.render());
        };
    };

    return Player;
});
