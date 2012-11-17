$(function() {
	var canvas = document.getElementById('image');
	var detector;
    var image=new Image();
    var originalImage;
    image.onload=function(){
        canvas.width=image.width;
        canvas.height=image.height;
        canvas.getContext('2d').drawImage(image,0,0);
        new HAAR.Detector(haarcascade_mcs_mouth).image(image).complete(function(){
            for (var i = 0; i < this.objects.length; i++) {
                var rect=this.objects[i];
                var ctx=canvas.getContext('2d');
                var mouth = ctx.getImageData(rect.x, rect.y, rect.width, rect.height);
                ctx.fillStyle="rgba(0,0,0,1)";
                ctx.fillRect(rect.x,rect.y,rect.width,rect.height);
                console.log(mouth);
                ctx.putImageData(mouth, 0, 0);
                setTimeout(function() {
                    ctx.drawImage(image, 0, 0);
                }, 5000);
            }
        }).detect(1, 1.25, 0.1, 1, true);
    };
    image.src='images/LOVE.png';
});
