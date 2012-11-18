requirejs.config({
    urlArgs: 'ts=' + (new Date).getTime()
});

requirejs(['app', 'Config', 'lastfm', 'jQuery', 'mouths', 'player'], function(App, config, LastFM, $, Mouths, Player) {
    var app = new App(),
        player = new Player(app),
        lastFm = new LastFM(config),
        $error = $('#error');

    app.subscribe('artist.search_start', function (name) {
        $error.hide();
        lastFm.artist.getInfo({ artist: name }, {
            success: function (data) {
                app.publish('top_tracks.search_start', { artist: name });
                lastFm.artist.getTopTracks({ artist: name }, {
                    success: function (data) {
                        app.publish('top_tracks.top_track_found', data.toptracks.track[0]);
                    },
                    error: function () {
                        app.publish('top_tracks.search_error');
                    }
                });
                var image = data.artist.image[data.artist.image.length - 1]['#text'];
                app.publish('artist.image_found', image);
            },
            error: function () {
                app.publish('artist.search_error');
            }
        });
    });

    app.subscribe('artist.image_found', function(imageUrl) {
        $('.q').blur();
        var mouths = new Mouths(imageUrl);
    });

    app.subscribe('artist.search_error', function () {
        $error.show();
    });

    app.subscribe('top_tracks.top_track_found', function(track) {
        player.play(track.artist.name, track.name);
        $.getJSON('/lyrics.php?q_track=' + track.name + '&q_artist=' + track.artist.name, function (data) {
            var $lyrics = $(data.message.body.subtitle.subtitle_body);
            $('#lyrics').append($('p', $lyrics));
        });
    });

    $('#lalalalalala').submit(function (e) {
        e.preventDefault();
        var name = $('.q', this).val();
        if ($.trim(name)) {
            app.publish('artist.search_start', name);
        }
    });
});
