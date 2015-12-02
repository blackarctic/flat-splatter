/*************************************************
	
	the player can be human or com, indicated by isHuman. Also keeps track of the
	chosen direction and boardspace of the player.
	
**************************************************/

Player = function (id, color, isHuman, boardSpace) {
	
	/***********************
	***** Constructing *****
	************************/
	
	var id = id;
	var isHuman = isHuman; // boolean representing if the player is a human or a com
	var color = color; // the SplatterColor of the player's character
	var direction = Direction.NONE; // the direction where the player will be heading
	var boardSpace = boardSpace; // the current location of the player on the board
	var stats = new PlayerStats();
	
	var persistentPowerUp = PowerUp.NONE;
	var persistentPowerUpUseTime;
	
	
	/************************
	*** Getters & Setters ***
	*************************/
	
	this.getID = function () {
		return id;
	}
	
	this.isHuman = function () {
		return isHuman;
	}
	
	this.getDirection = function () {
		return direction;
	}
	
	this.setDirection = function (newDirection) {
		direction = newDirection;
	}
	
	this.getBoardSpace = function () {
		return boardSpace;
	}
	
	this.getColor = function () {
		return color;
	}
	
	this.setColor = function (newColor) {
		color = newColor;
	}
	
	this.setBoardSpace = function (newBoardSpace) {
		boardSpace = newBoardSpace;
	}
	
	this.getPersistentPowerUp = function() {
		return persistentPowerUp;
	}
	
	this.getPersistentPowerUpUseTime = function() {
		return persistentPowerUpUseTime;
	}
	
	this.usePersistentPowerUp = function() {
		persistentPowerUp = PowerUp.NONE;
		persistentPowerUpUseTime = -1;
	}
	
	//sets the power up and the power up use time randomly for use in the game
	this.setRandomPersistentPowerUp = function(totalSecondsInGame) {
		persistentPowerUp = PowerUp.STEAL;
		persistentPowerUpUseTime = 0;
		while (persistentPowerUpUseTime <= 0 || persistentPowerUpUseTime >= totalSecondsInGame) {
			persistentPowerUpUseTime = Math.floor((Math.random() * totalSecondsInGame));
		}
		
	}
	
	this.getStats = function () {
		return stats;
	}
	
	this.setStats = function (newPlayerStats) {
		stats = newPlayerStats;
	}
	
	this.updateStats = function(percentageCovered, isWinner) {
		stats.updateStats(percentageCovered, isWinner);
	}
	
	
	/************************
	******* Functions *******
	*************************/
	
	this.reset = function (newBoardSpace, newIsHuman, newColor) {
		isHuman = newIsHuman;
		direction = Direction.NONE;
		boardSpace = newBoardSpace;
		color = newColor;
	}
	
	
	
}