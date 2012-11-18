define(['jQuery', 'Mousetrap', 'textstatistics'], function ($, mousetrap, TextStatistics) {

    /**
     * @param object data A response from the Musixmatch API with (hopefully)
     *     DFXP-encoded lyrics
     */
    var Syncerer = function (app, data, $el) {

        var syllables = [],
            counter = new TextStatistics();

        // It's not a hackday without a hack
        $el.append(data.message.body.subtitle.subtitle_body);
        $('p', $el).each(function (i, p) {
            var $p = $(p),
                start = convertDfxpTimestamp($p.attr('begin')),
                stop = convertDfxpTimestamp($p.attr('end')),
                length = stop - start,
                words = $p.text().split(/ /),
                syllableCount = words.length - 1, // Each space is a syllable...
                t = start;

            $p.data('start', start).data('stop', stop);

            for (i = 0; i < words.length; ++i) {
                syllableCount += counter.syllableCount(words[i]);
            }

            var syllableLength = length / syllableCount;

            for (i = 0; i < words.length; ++i) {
                for (j = 0; j < counter.syllableCount(words[i]); ++j) {
                    syllables.push({
                        start: t,
                        length: syllableLength
                    });
                    t += syllableLength;
                }
                syllables.push({
                    start: t,
                    length: syllableLength
                });
                t += syllableLength;
            }
        });

        this.start = function () {
            var currentSyllable = 0,
                eventFired = false,
                currentLyric = 0;
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

                // Display lyrics
                var $lyric = $('p:eq(' + currentLyric + ')', $el);
                if (time >= $lyric.data('start') && time < $lyric.data('stop')) {
                    $lyric.addClass('current-lyric');
                }
                if (time > $lyric.data('stop')) {
                    $lyric.removeClass('current-lyric');
                    ++currentLyric;
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
