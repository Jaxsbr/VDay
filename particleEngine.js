$.Particle = function(bounds, velocity, ttl, engine) {
    this.Bounds = bounds;
	this.Velocity = velocity;
	this.TTL = ttl;
	this.MaxTTL = this.TTL;	
	this.Engine = engine;

	this.Spin = 0;	
	this.CurrentSpin = 0;
	this.UseTexture = false;
}

$.Particle.prototype.SetTexture = function(texture, sourceX, sourceY, sourceW, sourceH) {	
	this.UseTexture = true;

	this.Texture = texture;	
	this.TextureFrameIndex = Math.floor($.RandomBetween(0.99, 2.99));
	this.TextureSourceWidth = sourceW;
	this.TextureSourceHeight = sourceH;
};

$.Particle.prototype.Update = function() {
	this.Bounds.Update();	
	
	this.Velocity = new $.Point(
		this.Velocity.X + (this.Engine.Gravity.X * $.Delta),
		this.Velocity.Y + (this.Engine.Gravity.Y * $.Delta));
	this.Bounds.X += this.Velocity.X;
	this.Bounds.Y += this.Velocity.Y;	

	this.TTL -= $.Delta;
	this.CurrentSpin += this.Spin;
}

$.Particle.prototype.Draw = function() {
	if (this.TTL <= 0) { return; }
	
	$.Gtx.save();
	$.Gtx.translate(this.Bounds.Centre.X, this.Bounds.Centre.Y);
	$.Gtx.rotate($.ToRadians(this.CurrentSpin));
	var percent = 1.0 - this.TTL / this.MaxTTL;

	if (this.UseTexture && this.Texture) {
		//$.Gtx.globalAlpha = percent;
		$.Gtx.drawImage(
			this.Texture,
			this.TextureFrameIndex * 50,
			0,
			50,
			50,
			-(this.Bounds.Width / 2), 
			-(this.Bounds.Height / 2), 
			this.Bounds.Width, 
			this.Bounds.Height);
	}
	else {		
		var color = this.Engine.Colors.GetColor(percent);			
		$.Gtx.globalAlpha = color.A;
		$.Gtx.fillStyle = color.ToCanvasColor();	
		$.Gtx.fillRect(
			-(this.Bounds.Width / 2), 
			-(this.Bounds.Height / 2), 
			this.Bounds.Width, 
			this.Bounds.Height);
	}

	$.Gtx.restore();
}


$.ParticleEngine = function(texture, width, height, frameCount) {
	this.Position = new $.Point(0, 0);
	this.Emit = false;
	this.ParticleCount = 100;
	this.TTL = 0.5;
	this.TTLVar = 0.52;
	this.Size = 2;
	this.MaxSize = 4;
	this.Colors = new $.Gradient([ 
		new $.Color(255, 255, 255, 1), 
		new $.Color(0, 0, 0, 0) ])
	this.Angle = 0;
	this.AngleVar = Math.PI	* 2;
	this.MinSpeed = 10;
	this.MaxSpeed = 15;
	this.Gravity = new $.Point(0, 0);
	this.CanBounce = false;
	this.Particles = [];
	this.Spin = 0;
	this.UseTexture = false;		

	if (texture) {
		this.SetTexture(texture, width, height, frameCount);
	}
};

$.ParticleEngine.prototype.SetTexture = function(texture, width, height, frameCount) {	
	this.UseTexture = true;

	var frameIndex = Math.floor($.RandomBetween(0.99, (frameCount - 1) + 0.99));

	this.Texture = texture;	
	this.TextureSourceWidth = width / frameCount;
	this.TextureSourceHeight = 0;
	this.TextureSourceX = frameIndex * this.TextureSourceWidth;
	this.TextureSourceY = height;	
};

$.ParticleEngine.prototype.Update =  function() {
	if (this.Emit) {
		var spawnCount = this.ParticleCount * $.Delta;
		for (var i = 0; i < spawnCount; i++) {
			this.Spawn((1.0 + i) / spawnCount * $.Delta);
		}
	}
	
	for (var i = 0; i < this.Particles.length; i++){
		if (this.Particles[i].TTL <= 0) {
			this.Particles.splice(i, 1);
			continue;
		}
		
		this.Particles[i].Update();
	}
}

$.ParticleEngine.prototype.Draw =  function() {
	for (var i = 0; i < this.Particles.length; i++) {
		this.Particles[i].Draw();
	}
}

$.ParticleEngine.prototype.Spawn = function(offset) {
	var angle = $.RandomVariation(this.Angle, this.AngleVar);
	var speed = $.RandomBetween(this.MinSpeed, this.MaxSpeed);
	var ttl = $.RandomVariation(this.TTL, this.TTL * this.TTLVar);
	
	x = Math.cos(angle) * speed;
	y = Math.sin(angle) * speed;
	var velocity = new $.Point(x, y);
	var size = $.RandomBetween(this.Size, this.MaxSize);
	var bounds = new $.Rectangle(
		this.Position.X + velocity.X * offset,
		this.Position.Y + velocity.Y * offset,
		size,
		size);
		
	var particle = new $.Particle(bounds, velocity, ttl, this);
	particle.Spin = this.Spin;

	if (this.Texture) {
		particle.SetTexture(
			this.Texture, 
			this.TextureSourceX,
			this.TextureSourceY,
			this.TextureSourceWidth,
			this.TextureSourceHeight);
	}
	this.Particles.push(particle);
}