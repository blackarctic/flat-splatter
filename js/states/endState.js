/*************************************************
	
	This is the end state that shows after the game ends
	
**************************************************/


Splatter.EndState = function(game) {
	
	var startText;
	
	var winner;
	var winnerSprite;
	var winnerText;
	var winnerPercentageText;
	
	
	//player 1 info
	var player1Title;
	
	var player1ThisLabel;
	var player1ThisValue;
	
	var player1BestLabel;
	var player1BestValue;
	
	var player1WinsLabel;
	var player1WinsValue;
	
	
	//player 2 info
	var player2Title;
	
	var player2ThisLabel;
	var player2ThisValue;
	
	var player2BestLabel;
	var player2BestValue;
	
	var player2WinsLabel;
	var player2WinsValue;
	
	var clickAudio;
	var startAudio;
	var resultAudio; //plays a different sound whether you won or lost (only in single player)
	
};

Splatter.EndState.prototype = {
	
	//returns the correct frame in the boardSpaces sprite sheet for the winner
	getPlayerFrame: function(playerColor) {
		var frameName;
		switch (playerColor) {
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
	
	
	//returns the correct name of the choice for the winner
	getPlayerName: function(playerColor) {
		var name;
		switch (playerColor) {
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
	
	//returns the correct RGBA color of the choice for the winner
	getPlayerRGBA: function(playerColor) {
		var name;
		switch (playerColor) {
			case SplatterColor.BLUE:
				name = "rgba(0, 100, 189, 1)";
				break;
			case SplatterColor.PINK:
				name = "rgba(165, 13, 94, 1)";
				break;
			case SplatterColor.GREEN:
				name = "rgba(26, 153, 51, 1)";
				break;
			case SplatterColor.PURPLE:
				name = "rgba(123, 20, 167, 1)";
				break;
		}
		return name;
	},
	
	create: function() {
		
		//background
		this.add.image(0,0,"mainBackground");
		
		//start text
		startText = this.add.image(this.world.centerX, this.world.centerY+300, "startText");
		startText.anchor.setTo(0.5,0.5);
		this.add.tween(startText).to({alpha : 0.1}, 1500, Phaser.Easing.Quadratic.Linear, true, 0, -1, true);
		
		
		//audio
		clickAudio = this.add.audio("clickAudio");
		startAudio = this.add.audio("startAudio");
		
		//winner info
		winner = manager.getCurrentWinner();
		winnerCoverage = (manager.getPerentageCoveredByPlayer(winner) * 100).toFixed(1);
		
		//winner audio
		if (manager.getNumOfHumanPlayers() > 1) {
			if (winner === manager.getHumanPlayer1() || winner === manager.getHumanPlayer2()) {
				resultAudio = this.add.audio("winAudio");
			}
			else {
				resultAudio = this.add.audio("loseAudio");
			}
		}
		else {
			if (winner === manager.getHumanPlayer1()) {
				resultAudio = this.add.audio("winAudio");
			}
			else {
				resultAudio = this.add.audio("loseAudio");
			}
		}
		resultAudio.play();
		
		//winner sprite
		winnerSprite = this.add.sprite(this.world.centerX, this.world.centerY-350, 'boardSpacesSheet', this.getPlayerFrame(winner.getColor()));
		winnerSprite.anchor.setTo(0.5, 0.5);
		
		//winner text
		winnerText = this.add.text(this.world.centerX, this.world.centerY-250, this.getPlayerName(winner.getColor()) + " Won", {fill : this.getPlayerRGBA(winner.getColor()), font : "60px edamameregular"});
		winnerText.anchor.setTo(0.5, 0.5);
		
		//winner percentage text
		winnerText = this.add.text(this.world.centerX, this.world.centerY-190, winnerCoverage + " %", {fill : this.getPlayerRGBA(winner.getColor()), font : "25px edamameregular"});
		winnerText.anchor.setTo(0.5, 0.5);
		
		
		
		//offset in case we don't have 2 players
		var player1XOffset = 250;
		if (manager.getNumOfHumanPlayers() > 1) { player1XOffset = 0; }
		
		
		//player 1 percentage text
		player1Title = this.add.text(this.world.centerX-250+player1XOffset, this.world.centerY-100, "Player 1", {fill : this.getPlayerRGBA(manager.getHumanPlayer1().getColor()), font : "40px edamameregular"});
		player1Title.anchor.setTo(0.5, 0.5);
		
		player1ThisLabel = this.add.text(this.world.centerX-250+player1XOffset, this.world.centerY-40, (manager.getPerentageCoveredByPlayer(manager.getHumanPlayer1())*100).toFixed(1) + "%   this", {fill : "rgba(127, 127, 127, 1)", font : "20px edamameregular"});
		player1ThisLabel.anchor.setTo(0.5, 0.5);
		
		player1BestLabel = this.add.text(this.world.centerX-250+player1XOffset, this.world.centerY, manager.getHumanPlayer1().getStats().getHighestPercentageCovered().toFixed(1) + "%   best", {fill : "rgba(127, 127, 127, 1)", font : "20px edamameregular"});
		player1BestLabel.anchor.setTo(0.5, 0.5);
		
		
		player1WinsLabel = this.add.text(this.world.centerX-250+player1XOffset, this.world.centerY+80, manager.getHumanPlayer1().getStats().getTotalWins().toString(), {fill : "rgba(80, 80, 80, 1)", font : "100px edamameregular"});
		player1WinsLabel.anchor.setTo(0.5, 0.5);
		
		player1WinsValue = this.add.text(this.world.centerX-250+player1XOffset, this.world.centerY+140, "wins", {fill : "rgba(127, 127, 127, 1)", font : "20px edamameregular"});
		player1WinsValue.anchor.setTo(0.5, 0.5);
		
		
		
		if (manager.getNumOfHumanPlayers() > 1) {
			
			player2Title = this.add.text(this.world.centerX+250, this.world.centerY-100, "Player 2", {fill : this.getPlayerRGBA(manager.getHumanPlayer2().getColor()), font : "40px edamameregular"});
			player2Title.anchor.setTo(0.5, 0.5);
			
			player2ThisLabel = this.add.text(this.world.centerX+250, this.world.centerY-40, (manager.getPerentageCoveredByPlayer(manager.getHumanPlayer2())*100).toFixed(1) + "%   this", {fill : "rgba(127, 127, 127, 1)", font : "20px edamameregular"});
			player2ThisLabel.anchor.setTo(0.5, 0.5);
			
			player2BestLabel = this.add.text(this.world.centerX+250, this.world.centerY, manager.getHumanPlayer2().getStats().getHighestPercentageCovered().toFixed(1) + "%   best", {fill : "rgba(127, 127, 127, 1)", font : "20px edamameregular"});
			player2BestLabel.anchor.setTo(0.5, 0.5);
			
			
			player2WinsLabel = this.add.text(this.world.centerX+250, this.world.centerY+80, manager.getHumanPlayer2().getStats().getTotalWins().toString(), {fill : "rgba(80, 80, 80, 1)", font : "100px edamameregular"});
			player2WinsLabel.anchor.setTo(0.5, 0.5);
			
			player2WinsValue = this.add.text(this.world.centerX+250, this.world.centerY+140, "wins", {fill : "rgba(127, 127, 127, 1)", font : "20px edamameregular"});
			player2WinsValue.anchor.setTo(0.5, 0.5);
			
		}
		
		
		
		
	},
	
	update: function() {
	
		//detect input -- if user clicks the spacebar, start the game
		if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.state.start("PlayState");
			startAudio.play();
		}
		
		//detect input -- esc to quit to the start state
		if (this.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
			this.state.start("StartState");
			clickAudio.play();
		}
	
	}
	
};