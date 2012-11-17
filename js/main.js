requirejs.config({
    urlArgs: 'ts=' + (new Date).getTime()
});

requirejs(['app'], function(App) {
    var app = new App();
});
