/*************************************************
	
	This is the start state that shows before the game begins
	
**************************************************/


Splatter.StartState = function(game) {
	var titleImage;
	var startText;
	
	var numOfPlayers;
	var numOfPlayersChangeSeen; //flag that changes when second player joins (for animation purposes)
	
	
	//player 1 choices
	var player1Choice;
	var player1ChoicesTitle;
	var player1Controls;
	
	var player1ChoiceIcon;
	var player1ChoiceText;
	
	var player1ChoiceClicked;
	
	
	//player 2 choices
	var player2Choice;
	var player2ChoicesTitle;
	var player2Controls;
	var player2Prompt;
	
	var player2ChoiceIcon;
	var player2ChoiceText;
	
	var player2ChoiceClicked;
	
	//audio
	var clickAudio;
	var startAudio;
	
	//keys
	var keyP;
	var keyESC;

};

Splatter.StartState.prototype = {
	
	//returns the correct frame in the boardSpaces sprite sheet for the player's character (color) choice
	getChoiceFrame: function(choice) {
		var frameName;
		switch (choice) {
			case SplatterColor.BLUE:
				frameName = "blueDown";
				break;
			case SplatterColor.PINK:
				frameName = "pinkDown";
				break;
			case SplatterColor.GREEN:
				frameName = "greenDown";
				break;
			case SplatterColor.PURPLE:
				frameName = "purpleDown";
				break;
		}
		return frameName;
	},
	
	
	//returns the correct name of the choice for the player's character (color) choice
	getChoiceName: function(choice) {
		var name;
		switch (choice) {
			case SplatterColor.BLUE:
				name = "Bloomy";
				break;
			case SplatterColor.PINK:
				name = "Padinkle";
				break;
			case SplatterColor.GREEN:
				name = "Grendik";
				break;
			case SplatterColor.PURPLE:
				name = "Plurple";
				break;
		}
		return name;
	},
	
	
	updatePlayerChoices : function() {
		if (numOfPlayers === 2) {manager.setPlayerColors(player1Choice, player2Choice); }
		else { manager.setPlayerColors(player1Choice, null); }
		
		//update player 1 choice in the GUI
		player1ChoiceIcon.frameName = this.getChoiceFrame(player1Choice);
		player1ChoiceText.text = this.getChoiceName(player1Choice);

	},
	
	player1ChoiceClickedReset : function() {
		player1ChoiceClicked = false;
	},
	
	player2ChoiceClickedReset : function() {
		player2ChoiceClicked = false;
	},
	
	create: function() {
		
		
		//initial variable sets
		numOfPlayersChangeSeen = true;
		numOfPlayers = 1;
		
		player1ChoiceClicked = false;
		player2ChoiceClicked = false;
		
		player1Choice = SplatterColor.randomExcluding();
		player2Choice = SplatterColor.randomExcluding([player1Choice]);
		
		var frameName;
		
		
		//background
		this.add.image(0,0,"mainBackground");
		
		//audio
		clickAudio = this.add.audio("clickAudio");
		startAudio = this.add.audio("startAudio");
		
		//title image
		titleImage = this.add.image(this.world.centerX, this.world.centerY-300, "title");
		titleImage.anchor.setTo(0.5,0.5);
		
		//start text
		startText = this.add.image(this.world.centerX, this.world.centerY+300, "startText");
		startText.anchor.setTo(0.5,0.5);
		this.add.tween(startText).to({alpha : 0.1}, 1500, Phaser.Easing.Quadratic.Linear, true, 0, -1, true);
		
		
		//player 1 choices
		player1ChoicesTitle = this.add.text(this.world.centerX-150, this.world.centerY-150, "Player 1", {fill : "rgba(80, 80, 80, 1)", font : "30px edamameregular"});
		player1ChoicesTitle.anchor.setTo(1,0.5);
		
		player1Controls = this.add.image(this.world.centerX-150, this.world.centerY-50, "controls1");
		player1Controls.anchor.setTo(1,0.5);
		
		player1ChoiceIcon = this.add.sprite(this.world.centerX-206, this.world.centerY+70, 'boardSpacesSheet', this.getChoiceFrame(player1Choice));
		player1ChoiceIcon.anchor.setTo(0.5,0.5);
		
		player1ChoiceText = this.add.text(this.world.centerX-204, this.world.centerY+150, this.getChoiceName(player1Choice), {fill : "rgba(80, 80, 80, 1)", font : "20px edamameregular"});
		player1ChoiceText.anchor.setTo(0.5,0.5);
		
		
		//player 2 choices
		player2ChoicesTitle = this.add.text(this.world.centerX+150, this.world.centerY-150, "Player 2", {fill : "rgba(80, 80, 80, 1)", font : "30px edamameregular"});
		player2ChoicesTitle.anchor.setTo(0,0.5);
		
		player2Prompt = this.add.image(this.world.centerX+100, this.world.centerY-50, "joinText");
		player2Prompt.anchor.setTo(0,0.5);
		
		player2Controls = this.add.image(this.world.centerX+150, this.world.centerY-50, "controls2");
		player2Controls.anchor.setTo(0,0.5);
		player2Controls.alpha = 0;
		
		player2ChoiceIcon = this.add.sprite(this.world.centerX+206, this.world.centerY+70, 'boardSpacesSheet', this.getChoiceFrame(player2Choice));
		player2ChoiceIcon.anchor.setTo(0.5,0.5);
		player2ChoiceIcon.alpha = 0;
		
		player2ChoiceText = this.add.text(this.world.centerX+204, this.world.centerY+150, this.getChoiceName(player2Choice), {fill : "rgba(80, 80, 80, 1)", font : "20px edamameregular"});
		player2ChoiceText.anchor.setTo(0.5,0.5);
		player2ChoiceText.alpha = 0;
		
		
		
		//event listeners for input - (special keyboard presses that cannot be held down need their own event listeners)
		keyP = game.input.keyboard.addKey(Phaser.Keyboard.P);
		keyP.onDown.add(function(key) {
			numOfPlayersChangeSeen = false;
			numOfPlayers = 2;
			manager.setNumOfHumanPlayers(2);
			clickAudio.play();
		}, this);
		
		keyESC = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
		keyESC.onDown.add(function(key) {
			numOfPlayersChangeSeen = false;
			numOfPlayers = 1;
			manager.setNumOfHumanPlayers(1);
			clickAudio.play();
		}, this);
		
		
		
		
		//necessary for starting a game
		manager.setNumOfHumanPlayers(1);
		this.updatePlayerChoices();
		
	},
	
	update: function() {
		
		//animate player 2 joining the game
		if (!numOfPlayersChangeSeen && numOfPlayers === 2) {
			
			//fade out the prompt
			this.add.tween(player2Prompt).to({alpha : 0}, 250, Phaser.Easing.Quadratic.LINEAR, true, 0);
			
			//fade in the choices
			this.add.tween(player2Controls).to({alpha : 1}, 250, Phaser.Easing.Quadratic.LINEAR, true, 250);
			this.add.tween(player2ChoiceIcon).to({alpha : 1}, 250, Phaser.Easing.Quadratic.LINEAR, true, 250);
			this.add.tween(player2ChoiceText).to({alpha : 1}, 250, Phaser.Easing.Quadratic.LINEAR, true, 250);

			numOfPlayersChangeSeen = true;
			this.updatePlayerChoices();
		}
		
		//animate player 2 leaving the game
		if (!numOfPlayersChangeSeen && numOfPlayers === 1) {
			
			//fade out the choices
			this.add.tween(player2Controls).to({alpha : 0}, 250, Phaser.Easing.Quadratic.LINEAR, true, 0);
			this.add.tween(player2ChoiceIcon).to({alpha : 0}, 250, Phaser.Easing.Quadratic.LINEAR, true, 0);
			this.add.tween(player2ChoiceText).to({alpha : 0}, 250, Phaser.Easing.Quadratic.LINEAR, true, 0);
			
			//fade in the prompt
			this.add.tween(player2Prompt).to({alpha : 1}, 250, Phaser.Easing.Quadratic.LINEAR, true, 250);

			numOfPlayersChangeSeen = true;
			this.updatePlayerChoices();
		}
		
		
		
		//update player 1 choice in the GUI
		player1ChoiceIcon.frameName = this.getChoiceFrame(player1Choice);
		player1ChoiceText.setText(this.getChoiceName(player1Choice));
		
		//update player 2 choice in the GUI
		player2ChoiceIcon.frameName = this.getChoiceFrame(player2Choice);
		player2ChoiceText.setText(this.getChoiceName(player2Choice));
		
		
		
		//detect input -- player 1 switching colors
		var player1ChoiceTimer;
		if ((this.input.keyboard.isDown(Phaser.Keyboard.D) || this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) && !player1ChoiceClicked) {
			
			player1ChoiceClicked = true;
			player1ChoiceTimer = this.time.create(false);
			player1ChoiceTimer.add(200, this.player1ChoiceClickedReset, this);
			player1ChoiceTimer.start();
			
			player1Choice = SplatterColor.nextExcluding(player1Choice, [player2Choice]);
			this.updatePlayerChoices();
			
			clickAudio.play();
		}
		
		if ((this.input.keyboard.isDown(Phaser.Keyboard.A) || this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) && !player1ChoiceClicked) {
			
			player1ChoiceClicked = true;
			player1ChoiceTimer = this.time.create(false);
			player1ChoiceTimer.add(200, this.player1ChoiceClickedReset, this);
			player1ChoiceTimer.start();
			
			player1Choice = SplatterColor.prevExcluding(player1Choice, [player2Choice]);
			this.updatePlayerChoices();
			
			clickAudio.play();
		}
		
		//detect input -- player 2 switching colors
		var player2ChoiceTimer;
		if (this.input.keyboard.isDown(Phaser.Keyboard.COLON) && !player2ChoiceClicked) {
			
			player2ChoiceClicked = true;
			player2ChoiceTimer = this.time.create(false);
			player2ChoiceTimer.add(200, this.player2ChoiceClickedReset, this);
			player2ChoiceTimer.start();
			
			player2Choice = SplatterColor.nextExcluding(player2Choice, [player1Choice]);
			this.updatePlayerChoices();
			
			clickAudio.play();
		}
		
		if (this.input.keyboard.isDown(Phaser.Keyboard.K) && !player2ChoiceClicked) {
			
			player2ChoiceClicked = true;
			player2ChoiceTimer = this.time.create(false);
			player2ChoiceTimer.add(200, this.player2ChoiceClickedReset, this);
			player2ChoiceTimer.start();
			
			player2Choice = SplatterColor.prevExcluding(player2Choice, [player1Choice]);
			this.updatePlayerChoices();
			
			clickAudio.play();
		}
		
		
		
		
		//detect input - detect player 2 joining (code is above in create function)
		
		//detect input -- esc to unjoin the second player (code is above in create function)
		
		
		
		//detect input -- if user clicks the spacebar, start the game
		if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.state.start("PlayState");
			
			startAudio.play();
		}
	
	}
	
};