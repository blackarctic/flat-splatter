var Splatter = {};

Splatter.BootState = function(game) {};

Splatter.BootState.prototype =  {
	
	preload: function () {
		//no assets yet
	},
	
	create: function () {
		this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = false;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = 270;
		this.scale.minHeight = 480;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.stage.forcePortrait = true;
		this.scale.setScreenSize(true);
		
		this.input.addPointer();
		this.stage.backgroundColor = "rgba(235, 252, 216, 1)";
		
		this.state.start("PreloaderState");
	}
}