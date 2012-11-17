requirejs.config({
    urlArgs: 'ts=' + (new Date).getTime()
});

requirejs(['app', 'Config', 'lastfm'], function(App, config, LastFM) {
    var app = new App(),
        lastFm = new LastFM(config);
});
