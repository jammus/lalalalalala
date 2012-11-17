define(['Mousetrap'], function(mousetrap) {
    var Mouths = function(imageUrl) {
        var mouths = [ ];
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
                new HAAR.Detector(haarcascade_mcs_mouth).image(image).complete(function(){
                    for (var i = 0; i < this.objects.length; i++) {
                        var rect=this.objects[i];
                        var mouth = {
                            image: ctx.getImageData(rect.x, rect.y, rect.width, rect.height),
                            coords: rect
                        };
                        mouths.push(mouth);
                    }
                }).detect(1, 1.25, 0.1, 1, true);
            };
            image.src = 'loadimage.php?image=' + imageUrl;

            mousetrap.bind('space', function(evt) {
                evt.preventDefault();
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
                resetTimeout = setTimeout(resetImage, 150);
            });

            function resetImage() {
                ctx.drawImage(image, 0, 0);
            }
        });
    };

    return Mouths;
});
