$.Animation = function(image, speed, frameWidth, frameHeight, frameCount) {	
	this.Image = image;	
	this.Speed = speed;	
	this.FrameWidth = frameWidth;
	this.FrameHeight = frameHeight;
	this.FrameCount = frameCount;
	this.FrameIndex = 0;	
	this.Ellapsed = 0;
}

$.Animation.prototype.Draw = function(x, y, width, height) {

	this.Ellapsed += $.Delta;
	if (this.Ellapsed >= this.Speed) {
		this.Ellapsed = 0;
		
		this.FrameIndex += 1;
		if (this.FrameIndex >= this.FrameCount) {
				this.FrameIndex = 0;
			}		
	}	
	
	$.Gtx.drawImage(
		this.Image,
		this.FrameIndex * this.FrameWidth, // Source x
		0, // Source y
		this.FrameWidth, // Source width
		this.FrameHeight, // Source height
		x, // Destination x
		y, // Destination y
		width == 0 ? this.FrameWidth : width, // Destination width
		height == 0 ? this.FrameHeight : height); // Destination height
}