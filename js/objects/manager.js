/*************************************************
	
	The Manager is the main class of the game. It holds all the game information.
	
**************************************************/

Manager = function () {
	
	/***********************
	***** Constructing *****
	************************/
	
	var totalSecondsInGame = 15;
	
	var isOver; // boolean represeting if we have a game over
	var quit; // boolean representing if the player quit or not
	var secondsRemaining;
	var board;
	var players;
	var numOfHumanPlayers;
	var playerColors;
	
	var persistentPowerUpUsed = false; //flag if the persistent power up has been used and the GUI hasn't seen it yet
	var persistentPowerUpUsedBy = null; //player who used the persistent power up this game
	var seenPersistentPowerUpUsed = false; //flag if the persistent power up has been seen by the GUI yet
	
	
	
	/************************
	*** Getters & Setters ***
	*************************/
	
	this.isGameOver = function () {
		return isOver;
	}
	
	this.getSecondsRemaining = function () {
		return secondsRemaining;
	}
	
	this.getTotalSecondsInGame = function () {
		return totalSecondsInGame;
	}
	
	this.getSecondsElapsed = function () {
		return totalSecondsInGame - secondsRemaining;
	}
	
	this.getTimeRemainingPercentage = function () {
		return secondsRemaining / (1.0 * totalSecondsInGame);
	}
	
	this.getBoard = function () {
		return board;
	}
	
	this.setNumOfHumanPlayers = function (num) {
		numOfHumanPlayers = num;
	}
	
	this.getNumOfHumanPlayers = function () {
		return numOfHumanPlayers;
	}
	
	this.getPlayer = function (index) {
		return players[index];
	}
	
	this.getPlayers = function () {
		return players;
	}
	
	this.getHumanPlayer1 = function () {
		return players[0];
	}
	
	this.getHumanPlayer2 = function () {
		if (this.getNumOfHumanPlayers() < 2) { return null; }
		return players[1];
	}
	
	this.getComPlayers = function () {
		var comPlayers;
		if (this.getNumOfHumanPlayers() === 1) {
			comPlayers = [players[1], players[2], players[3]];
		}
		else {
			comPlayers = [players[2], players[3]];
		}
		
		return comPlayers;
	}
	
	this.hasQuitTheGame = function () {
		return quit;
	}
	
	this.getPersistentPowerUpUsed = function () {
		return persistentPowerUpUsed;
	}
	
	this.getPersistentPowerUpUsedBy = function () {
		return persistentPowerUpUsedBy;
	}
	
	this.isSeenPersistentPowerUpUsed = function () {
		return seenPersistentPowerUpUsed;
	}
	
	this.setSeenPersistentPowerUpUsed = function () {
		seenPersistentPowerUpUsed = true;
	}
	
	
	
	
	
	
	
	/************************
	********* Game **********
	*************************/
	
	
	//sets the player colors
	//player2Color must be set to null if no player 2 exists
	this.setPlayerColors = function (player1Color, player2Color) {
		playerColors = [];
		playerColors[0] = player1Color;
		
		//if we have 2 players, take its color, otherwise assign it a random one
		if (player2Color !== null) {
			playerColors[1] = player2Color;
		}
		else {
			playerColors[1] = SplatterColor.randomExcluding(playerColors);
		}
		
		
		//set up com players
		playerColors[2] = SplatterColor.randomExcluding(playerColors);
		playerColors[3] = SplatterColor.randomExcluding(playerColors);
	}
	
	
	
	//initializes all the variables for the class for a new game
	//assumes that setPlayerColors() and setNumOfHumanPlayers() have already been called
	this.startNewGame = function () {
		
		//check prereqs
		if (!numOfHumanPlayers || !playerColors) {
			throw "new game pre-reqs not met";
			return;
		}
		
		isOver = false;
		quit = false;
		secondsRemaining = totalSecondsInGame;
		board = new Board();
		
		persistentPowerUpUsed = false;
		persistentPowerUpUsedBy = null;
		seenPersistentPowerUpUsed = false;
		
		var boardSpace;
		
		//set up new players if this is our first game
		if (!Array.isArray(players)) {
			
			//create the players array
			players = [];
			
			//create human player on the board
			boardSpace = board.getBoardSpace(0, 0);
			players[0] = new Player(0, playerColors[0], (this.getNumOfHumanPlayers() > 0), boardSpace);
			boardSpace.setOccupant(players[0]);
			
			//create first com player on the board
			boardSpace = board.getBoardSpace(board.getWidth()-1, 0);
			players[1] = new Player(1, playerColors[1], (this.getNumOfHumanPlayers() > 1), boardSpace);
			boardSpace.setOccupant(players[1]);
			
			//create second com player on the board
			boardSpace = board.getBoardSpace(0, board.getHeight()-1);
			players[2] = new Player(2, playerColors[2], (this.getNumOfHumanPlayers() > 2), boardSpace);
			boardSpace.setOccupant(players[2]);
			
			//create third com player on the board
			boardSpace = board.getBoardSpace(board.getWidth()-1, board.getHeight()-1);
			players[3] = new Player(3, playerColors[3], (this.getNumOfHumanPlayers() > 3), boardSpace);
			boardSpace.setOccupant(players[3]);
		}
		
		//otherwise, simply reset the players
		else {
			
			//reset human player on the board
			boardSpace = board.getBoardSpace(0, 0);
			players[0].reset(boardSpace, (this.getNumOfHumanPlayers() > 0), playerColors[0]);
			boardSpace.setOccupant(players[0]);
			
			//reset first com player on the board
			boardSpace = board.getBoardSpace(board.getWidth()-1, 0);
			players[1].reset(boardSpace, (this.getNumOfHumanPlayers() > 1), playerColors[1]);
			boardSpace.setOccupant(players[1]);
			
			//reset second com player on the board
			boardSpace = board.getBoardSpace(0, board.getHeight()-1);
			players[2].reset(boardSpace, (this.getNumOfHumanPlayers() > 2), playerColors[2]);
			boardSpace.setOccupant(players[2]);
			
			//reset third com player on the board
			boardSpace = board.getBoardSpace(board.getWidth()-1, board.getHeight()-1);
			players[3].reset(boardSpace, (this.getNumOfHumanPlayers() > 3), playerColors[3]);
			boardSpace.setOccupant(players[3]);
		}
		
		
		//generate power ups
		this.generatePowerUps(4);
		
	}
	
	// called when the game ends to perform some final cleanup
	// the quit parameter is if the user intentionally quit or not
	this.endGame = function (hasQuit) {
		isOver = true;
		quit = hasQuit;
		
		if (!quit) {
			var winner = this.getCurrentWinner();
		
			for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
				
				var player = players[playerIndex];
				var totalPercentageCovered = this.getPerentageCoveredByPlayer(player);
				
				// if player is a winner
				if (player === winner) {
					player.setRandomPersistentPowerUp(totalSecondsInGame);
					player.updateStats(totalPercentageCovered, true);
				}
				
				// if player is a loser
				else {
					player.updateStats(totalPercentageCovered, false);
				}
				
			}
		}
		
		
	}
	
	
	this.quitGame = function () {
		this.endGame(true);
	}
	
	
	
	// uses the persistent power ups of the players if the time matches the secondsRemaining
	this.usePersistentPowerUps = function () {
		
		if (this.isGameOver()) { return; }
		
		for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
			var player = players[playerIndex];
			
			if (player.getPersistentPowerUp() !== PowerUp.NONE && player.getPersistentPowerUpUseTime() === secondsRemaining) {
				this.handlePowerUpHit(player.getBoardSpace(), player, player.getPersistentPowerUp(), true);
			}
		}
	}
	
	
	// decreases the secondsRemaining by one and check if game is over
	this.decrementSecRemaining = function () {
		
		if (this.isGameOver()) { return; }
		
		secondsRemaining--;
		
		//if game is over, end game
		if (secondsRemaining === 0) {
			this.endGame(false);
		}
	}
	
	
	//returns the current winning player by number of spaces owned
	this.getCurrentWinner = function () {
		var scores = [0,0,0,0];
		
		//compile scores array
		scores = [0,0,0,0]
		for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
			scores[playerIndex] = this.getPerentageCoveredByPlayer(players[playerIndex]);
		}
		
		//find the best score
		var winningScoresIndex = 0;
		for (var scoresIndex = 0; scoresIndex < scores.length; scoresIndex++) {
			if (scores[scoresIndex] > scores[winningScoresIndex]) {
				winningScoresIndex = scoresIndex;
			}
		}
		
		return players[winningScoresIndex]; //return the corresponding best player
	}
	
	//returns the given player's percentage of board covered (return example: 0.35)
	this.getPerentageCoveredByPlayer = function (player) {
		var totalSpacesOwned = 0;
		for (var x = 0; x < board.getWidth(); x++) {
			for (var y = 0; y < board.getHeight(); y++) {
				if (board.getBoardSpace(x,y).getOwner() === player) {
					totalSpacesOwned++;
				}
			}
		}
		var total = totalSpacesOwned / (1.0 * (board.getWidth() * board.getHeight()));
		return total;
	}
	
	
	
	
	/************************
	******* Power Ups *******
	*************************/
	
	//calls the correct function below for handling the power up hits
	this.handlePowerUpHit = function (boardSpace, player, powerUp, isPersisent) {
		
		if (this.isGameOver()) { return; }
		
		switch (powerUp) {
			
			case PowerUp.SHOT:
				this.handlePowerUpHit_Shot(boardSpace, player);
				break;
				
			case PowerUp.RING:
				this.handlePowerUpHit_Ring(boardSpace, player);
				break;
				
			case PowerUp.STEAL:
				this.handlePowerUpHit_Steal(boardSpace, player);
				break;
			
		}
		
		if (isPersisent) {
			player.usePersistentPowerUp();
			persistentPowerUpUsed = true;
			persistentPowerUpUsedBy = player;
		}
		else {
			boardSpace.powerUpUsed(); //mark the powerup as used (reset it to none)
		}
	}
	
	//gives the player ownership of the spaces in front of the boardSpace (direction dependent)
	this.handlePowerUpHit_Shot = function (boardSpace, player) {
		
		if (this.isGameOver()) { return; }
		
		var dir = player.getDirection();
		
		switch (dir) {
			
			case Direction.UP:
				while (board.spaceExistsAt(boardSpace.getX(), boardSpace.getY()-1)) {
					boardSpace = board.getBoardSpace(boardSpace.getX(),boardSpace.getY()-1);
					boardSpace.setOwner(player);
				}
				break;
				
			case Direction.DOWN:
				while (board.spaceExistsAt(boardSpace.getX(), boardSpace.getY()+1)) {
					boardSpace = board.getBoardSpace(boardSpace.getX(), boardSpace.getY()+1);;
					boardSpace.setOwner(player);
				}
				break;
			
			case Direction.LEFT:
				while (board.spaceExistsAt(boardSpace.getX()-1, boardSpace.getY())) {
					boardSpace = board.getBoardSpace(boardSpace.getX()-1, boardSpace.getY());;
					boardSpace.setOwner(player);
				}
				break;
			
			case Direction.RIGHT:
				while (board.spaceExistsAt(boardSpace.getX()+1, boardSpace.getY())) {
					boardSpace = board.getBoardSpace(boardSpace.getX()+1, boardSpace.getY());;
					boardSpace.setOwner(player);
				}
				break;
		}
	}
	
	
	//gives the player ownership of the 8 spaces surrounding the boardSpace
	this.handlePowerUpHit_Ring = function (boardSpace, player) {
		
		var originalBoardSpace = boardSpace;
		
		if (this.isGameOver()) { return; }
		
		//Directionals
		if (board.spaceExistsAt(originalBoardSpace.getX()+1, originalBoardSpace.getY())) {
			boardSpace = board.getBoardSpace(originalBoardSpace.getX()+1, originalBoardSpace.getY());;
			boardSpace.setOwner(player);
		}
		if (board.spaceExistsAt(originalBoardSpace.getX()-1, originalBoardSpace.getY())) {
			boardSpace = board.getBoardSpace(originalBoardSpace.getX()-1, originalBoardSpace.getY());;
			boardSpace.setOwner(player);
		}
		
		if (board.spaceExistsAt(originalBoardSpace.getX(), originalBoardSpace.getY()+1)) {
			boardSpace = board.getBoardSpace(originalBoardSpace.getX(), originalBoardSpace.getY()+1);;
			boardSpace.setOwner(player);
		}
		if (board.spaceExistsAt(originalBoardSpace.getX(), originalBoardSpace.getY()-1)) {
			boardSpace = board.getBoardSpace(originalBoardSpace.getX(), originalBoardSpace.getY()-1);;
			boardSpace.setOwner(player);
		}
		
		//Diagonals
		if (board.spaceExistsAt(originalBoardSpace.getX()+1, originalBoardSpace.getY()+1)) {
			boardSpace = board.getBoardSpace(originalBoardSpace.getX()+1, originalBoardSpace.getY()+1);;
			boardSpace.setOwner(player);
		}
		if (board.spaceExistsAt(originalBoardSpace.getX()-1, originalBoardSpace.getY()-1)) {
			boardSpace = board.getBoardSpace(originalBoardSpace.getX()-1, originalBoardSpace.getY()-1);;
			boardSpace.setOwner(player);
		}
		
		if (board.spaceExistsAt(originalBoardSpace.getX()-1, originalBoardSpace.getY()+1)) {
			boardSpace = board.getBoardSpace(originalBoardSpace.getX()-1, originalBoardSpace.getY()+1);;
			boardSpace.setOwner(player);
		}
		if (board.spaceExistsAt(originalBoardSpace.getX()+1, originalBoardSpace.getY()-1)) {
			boardSpace = board.getBoardSpace(originalBoardSpace.getX()+1, originalBoardSpace.getY()-1);;
			boardSpace.setOwner(player);
		}
	}
	
	
	//gives the player ownership of a random player's boardSpaces
	this.handlePowerUpHit_Steal = function (boardSpace, player) {
		
		if (this.isGameOver()) { return; }
		
		victimPlayer = player;
		while (victimPlayer === player) {
			victimPlayer = players[Math.floor(Math.random() * (players.length-1))];
		}
		
		for (var x = 0; x < board.getWidth(); x++) {
			for (var y = 0; y < board.getHeight(); y++) {
				if (board.getBoardSpace(x,y).getOwner() === victimPlayer) {
					board.getBoardSpace(x,y).setOwner(player);
				}
			}
		}
		
	}
	
	//generates the given number of PowerUps onto non-occupied board spaces
	this.generatePowerUps = function (numOfPowerUps) {
		
		if (this.isGameOver()) { return; }
		
		if (!numOfPowerUps) {
			numOfPowerUps = Math.floor((Math.random() * 4)+1); // random number between 1 and 4
		}
		
		for (var powerUpCount = 0; powerUpCount < numOfPowerUps; powerUpCount++) {
			
			var newBoardSpace = null;
			
			//grab random empty board space
			while (true) {
				var randX = Math.floor(Math.random() * board.getWidth()); // random number between 0 and board width - 1
				var randY = Math.floor(Math.random() * board.getHeight()); // random number between 0 and board width - 1
				
				if (!board.getBoardSpace(randX, randY).isOccupied()) {
					newBoardSpace = board.getBoardSpace(randX, randY);
					break;
				}
			}
			
			newBoardSpace.setPowerUp(PowerUp.random());
			newBoardSpace.setOwner(null);
			
		}
	}
	
	
	
	
	/************************
	******* Movement ********
	*************************/
	
	//moves the players in the direction they are set in. (also handles com players "AI")
	this.movePlayers = function () {
		
		if (this.isGameOver()) { return; }
		
		for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
			
			//if its a com, pick a direction for it
			if (!players[playerIndex].isHuman()) {
				players[playerIndex].setDirection(Direction.random());
			}
			
			var dir = players[playerIndex].getDirection();
			var boardSpace = players[playerIndex].getBoardSpace();
			
			var newBoardSpace = null;
			switch (dir) {
				case Direction.UP:
					if (board.isLegalMove(boardSpace.getX(), boardSpace.getY()-1)) {
						newBoardSpace = board.getBoardSpace(boardSpace.getX(), boardSpace.getY()-1);
					}
					break;
				case Direction.DOWN:
					if (board.isLegalMove(boardSpace.getX(), boardSpace.getY()+1)) {
						newBoardSpace = board.getBoardSpace(boardSpace.getX(), boardSpace.getY()+1);
					}
					break;
				case Direction.LEFT:
					if (board.isLegalMove(boardSpace.getX()-1, boardSpace.getY())) {
						newBoardSpace = board.getBoardSpace(boardSpace.getX()-1, boardSpace.getY());
					}
					break;
				case Direction.RIGHT:
					if (board.isLegalMove(boardSpace.getX()+1, boardSpace.getY())) {
						newBoardSpace = board.getBoardSpace(boardSpace.getX()+1, boardSpace.getY());
					}
					break;
			}
			
			if (newBoardSpace !== null) {
				//remove player from old space
				boardSpace.setOccupant(null);
				//add player to new space
				players[playerIndex].setBoardSpace(newBoardSpace);
				newBoardSpace.setOccupant(players[playerIndex]);
				
				//check if we hit a PowerUp
				if (newBoardSpace.hasPowerUp()) {
					var powerUp = newBoardSpace.getPowerUp();
					this.handlePowerUpHit(newBoardSpace, players[playerIndex], powerUp, false);
				}
			}
		}
		
	}
	

	
	
	
	
	
}