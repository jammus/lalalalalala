define(['jQuery', 'Mousetrap', 'textstatistics'], function ($, mousetrap, TextStatistics) {

    /**
     * @param object data A response from the Musixmatch API with (hopefully)
     *     DFXP-encoded lyrics
     */
    var Syncerer = function (app, data, $el) {

        var syllables = [],
            t, // (ms)
            counter = new TextStatistics();

        // It's not a hackday without a hack
        $el.append(data.message.body.subtitle.subtitle_body);
        $('p', $el).each(function (i, p) {
            var $p = $(p),
                start = convertDfxpTimestamp($p.attr('begin')),
                stop = convertDfxpTimestamp($p.attr('end')),
                length = stop - start,
                words = $p.text().split(/ /),
                n = words.length,
                wordBoundaryLength = length / ((2 * n) - 1);

            for (i = 0; i < n; ++i) {
                var boundaryStart = start + (((2 * i) - 1) * wordBoundaryLength),
                    numSyllables = counter.syllableCount(words[i]),
                    syllableLength = wordBoundaryLength / numSyllables;

                for (j = 0; j < numSyllables; ++j) {
                    syllables.push({
                        start: boundaryStart + (j * syllableLength),
                        length: syllableLength
                    });
                }
            }
        });

        this.start = function () {
            var currentSyllable = 0,
                eventFired = false;
            app.subscribe('track.timeupdate', function (time) {
                if (typeof syllables[currentSyllable] == 'undefined') {
                    return;
                }
                var syllable = syllables[currentSyllable];
                if (time >= syllable.start && ! eventFired) {
                    app.publish('word.start', syllable.length / 2);
                    eventFired = true;
                };
                if (time >= syllable.start + syllable.length) {
                    ++currentSyllable;
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
