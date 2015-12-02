Splatter.PreloaderState = function(game) {
	this.ready = false;
};

Splatter.PreloaderState.prototype =  {
	
	preload: function () {
		
		// load images
		this.load.image("title", "assets/title.png");
		this.load.image("mainBackground", "assets/mainBackground.jpg");
		this.load.image("startText", "assets/startText.png");
		this.load.image("joinText", "assets/joinText.png");
		this.load.image("persPinkSteal", "assets/persPinkSteal.jpg");
		this.load.image("persBlueSteal", "assets/persBlueSteal.jpg");
		this.load.image("persGreenSteal", "assets/persGreenSteal.jpg");
		this.load.image("persPurpleSteal", "assets/persPurpleSteal.jpg");
		this.load.image("controls1", "assets/controls1.png");
		this.load.image("controls2", "assets/controls2.png");
		
		//load audio
		this.load.audio("levelUpAudio", "assets/levelUpSong.m4a");
		this.load.audio("clickAudio", "assets/click.wav");
		this.load.audio("powerUpAudio", "assets/powerUp.wav");
		this.load.audio("superPowerUpAudio", "assets/powerUp2.wav");
		this.load.audio("startAudio", "assets/start.wav");
		this.load.audio("endingAudio", "assets/ending.mp3");
		this.load.audio("loseAudio", "assets/lose.wav");
		this.load.audio("winAudio", "assets/win.wav");
		
		// load spritesheets
		this.load.atlasJSONArray("boardSpacesSheet","assets/boardSpacesSheet.png","assets/boardSpacesSheet.json");
		this.load.atlasJSONArray("powerUpsTextSheet","assets/powerUpsTextSheet.png","assets/powerUpsTextSheet.json");
		this.load.atlasJSONArray("keysSheet","assets/keysSheet.png","assets/keysSheet.json");
		
	},
	
	create: function () {
		music = this.add.audio("levelUpAudio");
		music.play('', 0, 0.5, true);
	},
	
	update: function () {
		if (this.cache.isSoundDecoded('levelUpAudio') && this.ready === false) {
			this.ready = true;
			this.state.start("StartState");
		}
		
	}
}