requirejs.config({
    urlArgs: 'ts=' + (new Date).getTime()
});

requirejs(['app', 'Config', 'lastfm', 'jQuery', 'mouths'], function(App, config, LastFM, $, Mouths) {
    var app = new App(),
        lastFm = new LastFM(config),
        $error = $('#error');

    app.subscribe('artist.search_start', function (name) {
        $error.hide();
        lastFm.artist.getInfo({ artist: name }, {
            success: function (data) {
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

    $('#lalalalalala').submit(function (e) {
        e.preventDefault();
        var name = $('.q', this).val();
        if ($.trim(name)) {
            app.publish('artist.search_start', name);
        }
    });
});
