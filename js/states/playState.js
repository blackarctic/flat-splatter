/*************************************************
	
	This is the main game state
	
**************************************************/


Splatter.PlayState = function(game) {
	
	//timer
	var timerBarIncrement; // the pixel increments that the timer will move each second
	var timerBar_BMPD; // the bitmap data for the timer bar
	var timerBar; // bar at the top of the page that shrinks as the secondsRemaining goes down
	var lastTimeUpdate; // the most recent time that we have seen and processed for the timer
	var timerTween;

	//game board
	var boardSpaceXOffset; // the x offset and y offset can be changed to resize the board while keeping it centered
	var boardSpaceYOffset;
	var boardSpaceWidth; // the board space width and height are calculated based on the world size and the above offsets
	var boardSpaceHeight;
	var boardSpaces; // 2D array indexed by [x][y] that holds the image for that board space
	
	//power ups
	var powerUpsText; //array of the power up text at each board space. indexed by powerUpsText[x][y]
	
	//persistent power ups
	var persistentPowerUpUseImage; //image that comes on screen to indicate that the persistent power up has been used
	
	//player choice indicators
	var player1ChoiceIndicator;
	var player2ChoiceIndicator;
	
	//timers
	var gameTimer; // controls the official game timer. when this runs out the game is over
	var powerUpTimer; // loop that controls how often new power ups are put on the board
	var playerMovementTimer; // loop that controls how often the players can move
	var persistentPowerUpTimer; //loop that checks every second if we are to use the persistent powerup for this round
	
	var endGameSeen; // flag that keeps track of if we have seen the end game
	
	
	//audio
	var powerUpAudio; //sound that is played when power up is used
	var superPowerUpAudio; //sound played for persisting power up used
	var clickAudio; //normal click sound
	var endingAudio; //dings played in the last 5 seconds
	
	
};

Splatter.PlayState.prototype = {
	
	create: function() {
		
		manager.startNewGame();
		endGameSeen = false;
		
		
		//background
		this.add.image(0,0,"mainBackground");
		
		
		//music
		powerUpAudio = this.add.audio("powerUpAudio");
		superPowerUpAudio = this.add.audio("superPowerUpAudio");
		endingAudio = this.add.audio("endingAudio");
		clickAudio = this.add.audio("clickAudio");
		
		
		
		//timer -- calculates pixel increment size and creates timer graphic
		timerBarIncrement = this.world.width / (1.0 * manager.getTotalSecondsInGame());
		lastTimeUpdate = -1;
		timerBar_BMPD = this.add.bitmapData(this.world.width, 20);
		timerBar_BMPD.ctx.beginPath();
		timerBar_BMPD.ctx.rect(0, 0, this.world.width, 20);
		timerBar_BMPD.ctx.fillStyle = "rgba(88, 88, 88, 0.8)";
		timerBar_BMPD.ctx.fill();
		timerBar = this.add.sprite(this.world.width, 0, timerBar_BMPD);
		timerBar.anchor.setTo(1, 0);
		
		
		//board and powerups -- creates the game board with the powerups
		boardSpaces = [];
		powerUpsText = [];
		
		var boardModel = manager.getBoard();
		boardSpaceXOffset = 150;
		boardSpaceYOffset = 150;
		boardSpaceWidth = (this.world.width-boardSpaceXOffset*2) / (1.0 * boardModel.getWidth());
		boardSpaceHeight = (this.world.height-boardSpaceYOffset*2) / (1.0 * boardModel.getHeight());
		
		for (var x = 0; x < boardModel.getWidth(); x++) {
			
			boardSpaces[x] = [];
			powerUpsText[x] = [];
			
			for (var y = 0; y < boardModel.getHeight(); y++) {
				
				//add board space sprites
				var boardSpaceModel = boardModel.getBoardSpace(x,y);
				if (boardSpaceModel.isOccupied()) {
					boardSpaces[x][y] = this.add.sprite(boardSpaceXOffset+(boardSpaceWidth*(x)), boardSpaceYOffset+(boardSpaceHeight*(y)), 'boardSpacesSheet', 'boardSpace');
				}
				else if (boardSpaceModel.hasOwner()) {
					boardSpaces[x][y] = this.add.sprite(boardSpaceXOffset+(boardSpaceWidth*(x)), boardSpaceYOffset+(boardSpaceHeight*(y)), 'boardSpacesSheet', 'boardSpace');
				}
				else if (boardSpaceModel.hasPowerUp()) {
					boardSpaces[x][y] = this.add.sprite(boardSpaceXOffset+(boardSpaceWidth*(x)), boardSpaceYOffset+(boardSpaceHeight*(y)), 'boardSpacesSheet', 'boardSpace');
				}
				else {
					boardSpaces[x][y] = this.add.sprite(boardSpaceXOffset+(boardSpaceWidth*(x)), boardSpaceYOffset+(boardSpaceHeight*(y)), 'boardSpacesSheet', 'boardSpace');
				}
				boardSpaces[x][y].width = boardSpaceWidth;
				boardSpaces[x][y].height = boardSpaceHeight;
				
				//add powerup text sprites
				powerUpsText[x][y] = this.add.sprite(boardSpaceXOffset+(boardSpaceWidth*(x)), boardSpaceYOffset+(boardSpaceHeight*(y)), 'powerUpsTextSheet', '');
				powerUpsText[x][y].width = boardSpaceWidth;
				powerUpsText[x][y].height = boardSpaceHeight;
				powerUpsText[x][y].alpha = 0;
			}
		}
		
		
		//player choice indicators
		if (manager.getNumOfHumanPlayers() === 1) { //we have 1 player, so show the indicator in the center
			player1ChoiceIndicator = this.add.text(this.world.centerX, this.world.height-75, this.getPlayerName(manager.getHumanPlayer1().getColor()), 
				{fill : this.getPlayerRGBA(manager.getHumanPlayer1().getColor()), font : "40px edamameregular"});
			player1ChoiceIndicator.anchor.setTo(0.5,0.5);
		}
		else { //we have 2 players, so show the indicators side by side
			player1ChoiceIndicator = this.add.text(this.world.centerX-200, this.world.height-75, this.getPlayerName(manager.getHumanPlayer1().getColor()), 
				{fill : this.getPlayerRGBA(manager.getHumanPlayer1().getColor()), font : "40px edamameregular"});
			player1ChoiceIndicator.anchor.setTo(0.5,0.5);
			player2ChoiceIndicator = this.add.text(this.world.centerX+200, this.world.height-75, this.getPlayerName(manager.getHumanPlayer2().getColor()), 
				{fill : this.getPlayerRGBA(manager.getHumanPlayer2().getColor()), font : "40px edamameregular"});
			player2ChoiceIndicator.anchor.setTo(0.5,0.5);
		}
		
		
		
		//create game timer
		gameTimer = this.time.create(false);
		gameTimer.loop(1000, manager.decrementSecRemaining, manager);
		gameTimer.start();
		
		//create power up creation timer
		powerUpTimer = this.time.create(false);
		powerUpTimer.loop(5000, manager.generatePowerUps, manager);
		powerUpTimer.start();
		
		//create player movement timer
		playerMovementTimer = this.time.create(false);
		playerMovementTimer.loop(300, manager.movePlayers, manager);
		playerMovementTimer.start();
		
		//create persistent power up timer
		persistentPowerUpTimer = this.time.create(false);
		persistentPowerUpTimer.loop(1000, manager.usePersistentPowerUps, manager);
		persistentPowerUpTimer.start();
		

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
	
	
	//returns the correct frameName for a board space based on what is happening on that space
	getFrameForBoardSpace: function(boardSpaceModel) {
			
		var frameName = "";
	
		if (boardSpaceModel.isOccupied()) {
			
			//get color
			switch (boardSpaceModel.getOccupant().getColor()) {
				case SplatterColor.BLUE:
					frameName = "blue";
					break;
				case SplatterColor.PINK:
					frameName = "pink";
					break;
				case SplatterColor.GREEN:
					frameName = "green";
					break;
				case SplatterColor.PURPLE:
					frameName = "purple";
					break;
			}
			
			//get direction
			switch (boardSpaceModel.getOccupant().getDirection()) {
				case Direction.UP:
					frameName += "Up";
					break;
				case Direction.DOWN:
					frameName += "Down";
					break;
				case Direction.LEFT:
					frameName += "Left";
					break;
				case Direction.RIGHT:
					frameName += "Right";
					break;
				case Direction.NONE:
					frameName += "Down";
					break;
			}
			
		}
		else if (boardSpaceModel.hasOwner()) {
			switch (boardSpaceModel.getOwner().getColor()) {
				
				case SplatterColor.BLUE:
					frameName = "blueOwn";
					break;
				case SplatterColor.PINK:
					frameName = "pinkOwn";
					break;
				case SplatterColor.GREEN:
					frameName = "greenOwn";
					break;
				case SplatterColor.PURPLE:
					frameName = "purpleOwn";
					break;
			}
		}
		else if (boardSpaceModel.hasPowerUp()) {
			frameName = "powerUpSpace";
		}
		else {
			frameName = "boardSpace";
		}
		
		return frameName;
	},
	
	
	//returns the correct frameName for the powerup hit on this boardspace (or null if nothing has been hit)
	getFrameForPowerUpText: function(boardSpaceModel) {
			
		var frameName = "";
		var powerUpHit = boardSpaceModel.seePowerUpHit(); //seePowerUpHit() also marks the powerUpHit as seen
		
		if (powerUpHit !== PowerUp.NONE) {
			
			//get powerup name
			switch (powerUpHit) {
				case PowerUp.SHOT:
					frameName = "shotText";
					break;
				case PowerUp.RING:
					frameName = "ringText";
					break;
				case PowerUp.STEAL:
					frameName = "stealText";
					break;
			}
			
			//get random leaning direction
			var randomLean = Math.floor((Math.random() * 2)+1); // random number between 1 and 2
			
			switch (randomLean) {
				case 1:
					frameName += "Left";
					break;
				case 2:
					frameName += "Right";
					break;
			}
			
			return frameName;
		}
		else {
			return null;
		}
		
		
	},
	
	
	// fades out the playState and then redirects to the endState
	fadeOutGame: function () {
		
		var fadeOutTime = 1000;
		
		//fade out the timer
		timerTween.stop();
		this.add.tween(timerBar).to({alpha : 0}, fadeOutTime, Phaser.Easing.Quadratic.EaseOut, true, 0);
		if (manager.getSecondsRemaining() === 0) {
			this.add.tween(timerBar).to({x : 0}, 0, Phaser.Easing.Quadratic.EaseOut, true, 0); //send the timerBar to the end of its path (yes, it's a bit of a hack)
		}
		
		
		//fade out the boardspaces and powerups text
		var boardModel = manager.getBoard();
		for (var x = 0; x < boardModel.getWidth(); x++) {
			for (var y = 0; y < boardModel.getHeight(); y++) {
				this.add.tween(boardSpaces[x][y]).to({alpha : 0}, fadeOutTime, Phaser.Easing.Quadratic.EaseOut, true, 0);
				this.add.tween(powerUpsText[x][y]).to({alpha : 0}, fadeOutTime, Phaser.Easing.Quadratic.EaseOut, true, 0);
			}
		}
		
		
		//fade out the player choice indicators
		this.add.tween(player1ChoiceIndicator).to({alpha : 0}, fadeOutTime, Phaser.Easing.Quadratic.EaseOut, true, 0);
		if (manager.getNumOfHumanPlayers() > 1) {
			this.add.tween(player2ChoiceIndicator).to({alpha : 0}, fadeOutTime, Phaser.Easing.Quadratic.EaseOut, true, 0);
		}
	
		//fade out the timer bar
		this.add.tween(timerBar).to({alpha : 0}, fadeOutTime, Phaser.Easing.Quadratic.EaseOut, true, 0);
		
		//create timer to redirect to the end game stats (or start screen if the user quit)
		var endGameTimer = this.time.create(false);
		if (manager.hasQuitTheGame()) {
			endGameTimer.add(fadeOutTime, function () { this.state.start("StartState"); }, this);
		}
		else {
			endGameTimer.add(fadeOutTime, function () { this.state.start("EndState"); }, this);
		}
		
		endGameTimer.start();
	},
	
	
	update: function() {
		
		//check if game is over
		if (manager.isGameOver()) {
			
			if (!endGameSeen) {
				
				endGameSeen = true;
				
				//stop timers
				gameTimer.remove();
				powerUpTimer.remove();
				playerMovementTimer.remove();
				persistentPowerUpTimer.remove();
				
				//fade out the game
				this.fadeOutGame();
				
			}
			
		}
		
		//if game is not over, play the damn game
		else {
			
			// timer -- creates a 1 sec tween that moves it the correct increments to the left
			if (manager.getSecondsRemaining() !== lastTimeUpdate) {
				var nextX = this.world.width - (timerBarIncrement * (manager.getSecondsElapsed()+1));
				timerTween = this.add.tween(timerBar).to({x : nextX}, 1000, Phaser.Easing.Quadratic.Linear, true, 0);
				lastTimeUpdate = manager.getSecondsRemaining();
				
				//if the timer is in the last 5 seconds, show red
				if (manager.getSecondsRemaining() === 5) {
					endingAudio.play();
					timerBar_BMPD.fill(200, 88, 88, 0.8);
				}
			}
	
			//board -- updates the game board
			var boardModel = manager.getBoard();
			for (var x = 0; x < boardModel.getWidth(); x++) {
				for (var y = 0; y < boardModel.getHeight(); y++) {
					
					var boardSpaceModel = boardModel.getBoardSpace(x,y);
					var newFrame;
					
					//update boardspace sprite
					newFrame = this.getFrameForBoardSpace(boardSpaceModel);
					boardSpaces[x][y].frameName = newFrame;
					
					//update powerup text sprite
					newFrame = this.getFrameForPowerUpText(boardSpaceModel);
					if (newFrame !== null) {
						powerUpsText[x][y].frameName = newFrame;
						powerUpsText[x][y].alpha = 1;
						powerUpAudio.play();
						this.add.tween(powerUpsText[x][y]).to({alpha : 0}, 1000, Phaser.Easing.Quadratic.Linear, true, 700);
					}
				}
			}
			
			
			//persistent powerup checking
			//if we have one and haven't seen it yet, add our image and fade it out slowly
			if (manager.getPersistentPowerUpUsed() && !manager.isSeenPersistentPowerUpUsed()) {
				
				superPowerUpAudio.play();
				
				switch(manager.getPersistentPowerUpUsedBy().getColor()) {
					case SplatterColor.BLUE:
						persistentPowerUpUseImage = this.add.image(0,0,"persBlueSteal");
						break;
					case SplatterColor.GREEN:
						persistentPowerUpUseImage = this.add.image(0,0,"persGreenSteal");
						break;
					case SplatterColor.PINK:
						persistentPowerUpUseImage = this.add.image(0,0,"persPinkSteal");
						break;
					case SplatterColor.PURPLE:
						persistentPowerUpUseImage = this.add.image(0,0,"persPurpleSteal");
						break;
				}
				this.add.tween(persistentPowerUpUseImage).to({alpha : 0}, 3000, Phaser.Easing.Quadratic.EASE_OUT, true, 0);
				
				manager.setSeenPersistentPowerUpUsed();
				
			}
			
			
			
			//detect input -- esc to quit to the start state
			if (this.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
				clickAudio.play();
				manager.quitGame();
			}
			
			//detect input for player 1-- WASD keys for human player movement
			if (this.input.keyboard.isDown(Phaser.Keyboard.W) || this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
				manager.getHumanPlayer1().setDirection(Direction.UP);
			}
			if (this.input.keyboard.isDown(Phaser.Keyboard.S) || this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
				manager.getHumanPlayer1().setDirection(Direction.DOWN);
			}
			if (this.input.keyboard.isDown(Phaser.Keyboard.A) || this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
				manager.getHumanPlayer1().setDirection(Direction.LEFT);
			}
			if (this.input.keyboard.isDown(Phaser.Keyboard.D) || this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
				manager.getHumanPlayer1().setDirection(Direction.RIGHT);
			}
			
			//detect input for player 2-- OKL; keys for human player movement
			if (manager.getNumOfHumanPlayers() > 1) {
				if (this.input.keyboard.isDown(Phaser.Keyboard.O)) {
					manager.getHumanPlayer2().setDirection(Direction.UP);
				}
				if (this.input.keyboard.isDown(Phaser.Keyboard.L)) {
					manager.getHumanPlayer2().setDirection(Direction.DOWN);
				}
				if (this.input.keyboard.isDown(Phaser.Keyboard.K)) {
					manager.getHumanPlayer2().setDirection(Direction.LEFT);
				}
				if (this.input.keyboard.isDown(Phaser.Keyboard.COLON)) {
					manager.getHumanPlayer2().setDirection(Direction.RIGHT);
				}
			}
			
			
			
			
			
		}
	}
	
};