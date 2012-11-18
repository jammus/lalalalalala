define(['jQuery', 'Mousetrap'], function ($, mousetrap) {

    /**
     * @param object data A response from the Musixmatch API with (hopefully)
     *     DFXP-encoded lyrics
     */
    var Syncerer = function (app, data, $el) {

        var boundaries = [],
            t; // (ms)

        // It's not a hackday without a hack
        $el.append(data.message.body.subtitle.subtitle_body);
        $('p', $el).each(function (i, p) {
            // TODO Weight the length of the word based on the number of
            // syllables
            var $p = $(p),
                start = convertDfxpTimestamp($p.attr('begin')),
                stop = convertDfxpTimestamp($p.attr('end')),
                length = stop - start,
                words = $p.text().split(/ /),
                n = words.length,
                wordBoundaryLength = length / ((2 * n) - 1);

            for (i = 0; i < n; ++i) {
                var boundaryStart = start + (((2 * i) - 1) * wordBoundaryLength);
                boundaries.push({
                    word: words[i],
                    start: boundaryStart,
                    length: wordBoundaryLength
                });
            }
        });

        this.start = function () {
            var currentBoundary = 0,
                eventFired = false;
            app.subscribe('track.timeupdate', function (time) {
                if (typeof boundaries[currentBoundary] == 'undefined') {
                    return;
                }
                var boundary = boundaries[currentBoundary];
                if (time >= boundary.start && ! eventFired) {
                    app.publish('word.start', boundary.length / 2);
                    eventFired = true;
                };
                if (time >= boundary.start + boundary.length) {
                    ++currentBoundary;
                    eventFired = false;
                }
            });
        };

        function convertDfxpTimestamp(timestamp) {
            var parts = timestamp.split(/[:\.]/),
                hours = parseInt(parts[0], 10),
                minutes = parseInt(parts[1], 10),
                seconds = parseInt(parts[2], 10),
                milliseconds = parseInt(parts[3], 10);
            return ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000 + milliseconds;
        }

    };

    return Syncerer;

});
