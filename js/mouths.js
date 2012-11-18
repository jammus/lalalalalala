define(function() {
    var Mouths = function(app, imageUrl) {
        var mouths,
            useFiltering = true;

        $(function() {
            var canvas = document.getElementById('image');
            var detector;
            var image=new Image();
            var originalImage;
            var ctx;
            var resetTimeout;
            image.onload=function(){
                ctx = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext('2d').drawImage(image,0,0);
                detectMouths(image);

            };
            image.src = 'loadimage.php?image=' + imageUrl;

            app.subscribe('word.start', function(length) {
                for (var i = 0; i < mouths.length; i++) {
                    var mouth = mouths[i];
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.fillRect(
                        mouth.coords.x,
                        mouth.coords.y,
                        mouth.coords.width,
                        mouth.coords.height
                    );
                    ctx.putImageData(mouth.image, mouth.coords.x, mouth.coords.y + (mouth.coords.height / 3));
                }
                resetTimeout = setTimeout(resetImage, length);
            });

            function resetImage() {
                ctx.drawImage(image, 0, 0);
            }

            function detectMouths(image) {
                var faces = [ ],
                    candidateMouths = [ ];
            
                new HAAR.Detector(haarcascade_frontalface_alt).image(image).complete(function() {
                    for (var i = 0; i < this.objects.length; i++) {
                        var rect = this.objects[i];
                        var face = {
                            coords: rect
                        };
                        var ctx=canvas.getContext('2d');
                        faces.push(face);
                    }
                    new HAAR.Detector(haarcascade_mcs_mouth).image(image).complete(function(){
                        for (var i = 0; i < this.objects.length; i++) {
                            var rect= this.objects[i];
                            var mouth = {
                                image: ctx.getImageData(rect.x, rect.y, rect.width, rect.height),
                                coords: rect
                            };
                            candidateMouths.push(mouth);
                        }
                        mouths = filterMouths(candidateMouths, faces);
                        if (mouths.length == 0) {
                            mouths = candidateMouths;
                        }
                    }).detect(1, 1.25, 0.1, 1, true);
                }).detect(1, 1.25, 0.1, 1, true);
                
            }

            function filterMouths(mouths, faces) {
                var filteredMouths = [ ];
                for (var i = 0; i < mouths.length; i++) {
                    if (isInsideAFace(mouths[i], faces)) {
                        filteredMouths.push(mouths[i]);
                    }
                }
                return filteredMouths;
            }

            function isInsideAFace(mouth, faces) {
                for (var i = 0; i < faces.length; i++) {
                    if (isInsideFace(mouth, faces[i].coords)) {
                        return true;
                    }
                }
            }

            function isInsideFace(mouth, face) {
                var mouthPoints = toPoints(mouth.coords);
                for (var i = 0; i < mouthPoints.length; i++) {
                    var point = mouthPoints[i];
                    if (isPointInside(point, face)) {
                        return true;
                    }
                }
            }

            function toPoints(coords) {
                var x1 = coords.x,
                    x2 = x1 + coords.width,
                    y1 = coords.y,
                    y2 = coords.y + coords.height;

                return [
                    { x: x1, y: y1 },
                    { x: x2, y: y1 },
                    { x: x1, y: y2 },
                    { x: x2, y: y2 }
                ];
            }

            function isPointInside(point, coords) {
                return point.x >= coords.x &&
                       point.x <= coords.x + coords.width &&
                       point.y >= coords.y &&
                       point.y <= coords.y + coords.height;
            }
        });
    };

    return Mouths;
});
