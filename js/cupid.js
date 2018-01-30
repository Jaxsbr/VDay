$.Cupid = function(x, y, w, h) {
	this.Bounds = new $.Rectangle(x, y, w, h);
	this.Direction = 0; // -1 left 1 right 0 no_movement
	this.Stages = { one: 0, two: 0, three: 0 };
	this.Tick = 0;
	
	this.IdleAnimation = new $.Animation(
		$.CupidImage, 
		0.2, 
		1240, 
		1016, 
		2);

	this.StageFlip = 7;
	this.StageElapsed = 4.5;	
	this.ToggleStage(1);

	this.ShootTick = 0.4;
	this.ShootElapsed = 0;

	this.CupidLoveTick = 2.5;
	this.CupidLoveElapsed = 0;

	this.Arrow = { 
		bounds: new $.Rectangle(0, 0, 280, 100),
		speed: 12
	};
		
	this.SetupParticles();
};

$.Cupid.prototype.SetupParticles = function() {
	this.ArrowParticleEngine = new $.ParticleEngine(
		$.HeartImage,
		50,
		50,
		0);
	this.ArrowParticleEngine.ParticleCount = 50;
	this.ArrowParticleEngine.Spin = 4;
	this.ArrowParticleEngine.Position.X = this.Arrow.bounds.X;
	this.ArrowParticleEngine.Position.Y = this.Arrow.bounds.Y;
	this.ArrowParticleEngine.Emit = false;
	this.ArrowParticleEngine.TTL = 5.5;
	this.ArrowParticleEngine.TTLVar = 5.52;
	this.ArrowParticleEngine.Size = 12;
	this.ArrowParticleEngine.MaxSize = 17;
	this.ArrowParticleEngine.Colors = new $.Gradient([ 
		new $.Color(255, 0, 0, 1), 
		new $.Color(100, 0, 255, 0) ]);
	this.ArrowParticleEngine.MinSpeed = 0.5;
	this.ArrowParticleEngine.MaxSpeed = 1;
	this.ArrowParticleEngine.Gravity = new $.Point(0, 7);

	this.CupidParticleEngine = new $.ParticleEngine(
		$.HeartImage,
		50,
		50,
		0);
	this.CupidParticleEngine.Spin = 10;
	this.CupidParticleEngine.ParticleCount = 150;
	this.CupidParticleEngine.Position.X = this.Bounds.Centre.X;
	this.CupidParticleEngine.Position.Y = this.Bounds.Centre.Y;
	this.CupidParticleEngine.Emit = false;
	this.CupidParticleEngine.TTL = 5.5;
	this.CupidParticleEngine.TTLVar = 5.52;
	this.CupidParticleEngine.Size = 25;
	this.CupidParticleEngine.MaxSize = 35;
	this.CupidParticleEngine.MinSpeed = 10;
	this.CupidParticleEngine.MaxSpeed = 15;
	this.CupidParticleEngine.Gravity = new $.Point(0, 6);
};

$.Cupid.prototype.Update = function() {
	this.Bounds.Update();
	this.Arrow.bounds.Update();	

	this.ArrowParticleEngine.Update();
	this.ArrowParticleEngine.Position.X = this.Arrow.bounds.Centre.X;
	this.ArrowParticleEngine.Position.Y = this.Arrow.bounds.Centre.Y;

	this.CupidParticleEngine.Update();
	this.CupidParticleEngine.Position.X = this.Bounds.Centre.X;
	this.CupidParticleEngine.Position.Y = this.Bounds.Centre.Y;

	this.Tick++;
	this.ShootElapsed += $.Delta;
	this.CupidLoveElapsed += $.Delta;

	if (this.CupidLoveElapsed >= this.CupidLoveTick){
		this.CupidLoveElapsed = 0;
		this.CupidParticleEngine.Emit = false;
	}
	
	if (this.Stages.one === 1) {
		this.StageElapsed += $.Delta;
		if (this.StageElapsed >= this.StageFlip) {
			this.StageElapsed = 0;
			this.ToggleStage(2);	
			this.ArrowParticleEngine.Emit = true;	
		}
	}
	
	this.Bounds.Y += (Math.sin(this.Tick / 18) * 0.7);

	if (this.Stages.one === 1) {		
		this.Bounds.X += (Math.cos(this.Tick / 13) * 0.7);	
		this.Arrow.bounds.X = this.Bounds.X;
		this.Arrow.bounds.Y = this.Bounds.Centre.Y;	
		this.ShootElapsed = 0;		
	}
	else if (this.Stages.two === 1) {		
		this.Arrow.bounds.X -= this.Arrow.speed;				

		if (this.Arrow.bounds.Right + 280 < $.CanvasBounds.Left) {
			this.Arrow.bounds.X = $.CanvasBounds.Right;
			this.ToggleStage(3);
		}
	}
	else if (this.Stages.three === 1) {
		this.Arrow.bounds.X -= this.Arrow.speed;

		var frontPoint = new $.Point(this.Arrow.bounds.X, this.Arrow.bounds.Centre.Y);
		var distance = frontPoint.DistanceBetween($.CanvasBounds.Centre);
		if (distance <= 140)
		{
			this.ToggleStage(1);
			this.ArrowParticleEngine.Emit = false;
			this.CupidParticleEngine.Emit = true;
			this.CupidLoveElapsed = 0;
		}
	}
	else {
		// Broken state, reset
		this.ToggleStage(0);

		// Todo: reset cupid position
	}
};

$.Cupid.prototype.ToggleStage = function (stage) {			
	this.Stages.one = 0;
	this.Stages.two = 0;
	this.Stages.three = 0;

	if (stage === 1) {
		this.Stages.one = 1;
	}
	else if (stage === 2) {
		this.Stages.two = 1;
	}
	else if (stage === 3) {
		this.Stages.three = 1;
	}
	else {
		this.Stages.one = 1;
	}
};

$.Cupid.prototype.Draw = function() {
	this.ArrowParticleEngine.Draw();
	this.CupidParticleEngine.Draw();

	if (this.Stages.two === 1 || this.Stages.three === 1) {		
		$.Gtx.drawImage($.ArrowImage, this.Arrow.bounds.X, this.Arrow.bounds.Y, this.Arrow.bounds.Width, this.Arrow.bounds.Height);
	}

	if (this.Stages.one === 0 && this.ShootElapsed <= this.ShootTick) {			
		$.Gtx.drawImage(
			$.CupidImage,
			2480,
			0,
			1240,
			1016,
			this.Bounds.X, 
			this.Bounds.Y, 
			this.Bounds.Width, 
			this.Bounds.Height);
	}
	else {
		this.IdleAnimation.Draw(this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);
	}	
};