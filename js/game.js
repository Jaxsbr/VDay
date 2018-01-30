$.Init = function () {
    $.InitRequestAnimationFrame();
    $.InitWindowEvents();
    $.InitGameVariables();
    $.InitCanvas();

	$.ObjectLoaded = false;
	$.LoadImages();
    $.GameLoop();
};

$.InitRequestAnimationFrame = function () {
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;
};

$.InitWindowEvents = function () {
    window.addEventListener('mousemove', $.MouseMove);
    window.addEventListener('mousedown', $.MouseDown);
    window.addEventListener('mouseup', $.MouseUp);
    window.addEventListener('keydown', $.KeyDown);
    window.addEventListener('keyup', $.KeyUp);
    window.addEventListener("keypress", $.KeyPress);
    window.addEventListener('resize', $.Resize);    
};

$.InitGameVariables = function () {
    $.Keys = [];
    $.KeyCodes = { A: 65, D: 68, S: 83, W: 87, ESC:27, ENTER: 13, SHIFT: 16, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
    $.MousePoint = new $.Point(0, 0);
    $.IsMouseDown = false;
    $.Delta = 0;
    $.Then = Date.now();
	
	
};

$.InitCanvas = function () {
    $.CanvasWidth = window.innerWidth;
    $.CanvasHeight = window.innerHeight;
    $.CanvasBounds = new $.Rectangle(0, 0, $.CanvasWidth, $.CanvasHeight);

    $.Canvas = document.getElementById('canvas');
    $.Canvas.width = $.CanvasWidth;
    $.Canvas.height = $.CanvasHeight;
    $.Canvas.style.marginTop = -$.CanvasHeight / 2 + 'px';
    $.Canvas.style.marginLeft = -$.CanvasWidth / 2 + 'px';

    $.Gtx = $.Canvas.getContext('2d');
};


$.MouseMove = function (e) {    
    $.MousePoint = new $.Point(e.clientX - $.Canvas.offsetLeft, e.clientY - $.Canvas.offsetTop);    
};

$.MouseDown = function () {
    $.IsMouseDown = true;
};

$.MouseUp = function () {
    $.IsMouseDown = false;
};

$.KeyDown = function (e) {
    $.Keys[e.keyCode] = true;

    if ($.Keys[$.KeyCodes.ESC]) {
        if ($.GameStates.Play == 1) {
            $.MenuPauseGame();
        }
    }
};

$.KeyUp = function (e) {
    $.Keys[e.keyCode] = false;
};

$.KeyPress = function (e) {

};

$.Resize = function () {
    $.InitCanvas();
};


$.LoadImages = function () {
    $.ImageCount = 4;
    $.ImagesLoaded = 0;   

	$.CupidImage = new Image();
	$.CupidImage.onload = function () { $.ImagesLoaded++; }
	$.CupidImage.src = 'img/cupido.png';

    $.ArrowImage = new Image();
	$.ArrowImage.onload = function () { $.ImagesLoaded++; }
	$.ArrowImage.src = 'img/arrows.png';

    $.HeartImage = new Image();
	$.HeartImage.onload = function () { $.ImagesLoaded++; }
	$.HeartImage.src = 'img/hearts.png';

    $.BackgroundImage = new Image();
	$.BackgroundImage.onload = function () { $.ImagesLoaded++; }
	$.BackgroundImage.src = 'img/background.png';
};

$.IsLoading = function () {
    if ($.ImagesLoaded == $.ImageCount) {
		return false;
    }
	return true;
};

$.GameLoop = function () {
    requestAnimationFrame($.GameLoop);
    $.UpdateDelta();

	if (!$.IsLoading()){		
		if (!$.ObjectLoaded) {			
			$.ObjectSetup();
		}
		$.UpdateGame();
		$.DrawGame();
	}
};

$.ObjectSetup = function(){
	var point = { 
		x: $.CanvasBounds.Centre.X - 248,
		y: $.CanvasBounds.Centre.Y - 202
	};
	$.TheCupid = new $.Cupid(point.x, point.y, 496, 404);		
	$.ObjectLoaded = true;	
};

$.UpdateDelta = function () {	
    var now = Date.now();
    var delta = now - $.Then;
    $.Delta = delta / 1000;
    $.Then = now;
};

$.UpdateGame = function () {	
	$.TheCupid.Update();
};

$.DrawGame = function () {
	$.Gtx.clearRect($.CanvasBounds.X, $.CanvasBounds.Y, $.CanvasBounds.Width, $.CanvasBounds.Height);

//alert($.CanvasBounds.Width);
//alert($.CanvasBounds.Height);
$.Gtx.drawImage(
    $.BackgroundImage, $.CanvasBounds.X, $.CanvasBounds.Y, $.CanvasBounds.Width, $.CanvasBounds.Height);

	$.TheCupid.Draw();
    $.DrawText();
};

$.DrawText = function () {
    var fontSize = 90;
    var text = "Happy Valentine's Day";
    var textWidth = $.Gtx.measureText(text).width;
    var x = $.CanvasBounds.Centre.X - (textWidth / 2);

    $.Gtx.font = "italic bold " + fontSize.toString() + "px Edwardian";
    $.Gtx.fillStyle = "black";
    $.Gtx.fillText(text, x + 3, fontSize + 3);

    $.Gtx.fillStyle = "red";
    $.Gtx.fillText(text, x, fontSize);
};