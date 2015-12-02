/*************************************************
	
	the boardSpaces keep track of who owns them, who occupies them, and what power ups are on them
	
**************************************************/

BoardSpace = function (x, y) {
	
	/***********************
	***** Constructing *****
	************************/
	
	var owner = null; // the Player who owns the boardspace
	var occupant = null; // the Player who is occupying the boardspace
	var powerUp = PowerUp.NONE; // the current PowerUp of the boardspace
	var powerUpHit = PowerUp.NONE; // the last unseen PowerUp that was hit on this boardspace
	var x = x;
	var y = y;
	
	
	/************************
	*** Getters & Setters ***
	*************************/
	
	this.hasOwner = function () {
		return owner !== null;
	}
	
	this.getOwner = function () {
		return owner;
	}
	
	this.setOwner = function (newOwner) {
		owner = newOwner;
	}
	
	this.isOccupied = function () {
		return occupant !== null;
	}
	
	this.getOccupant = function () {
		return occupant;
	}
	
	this.setOccupant = function (newOccupant) {
		occupant = newOccupant;
		if (newOccupant !== null) {
			this.setOwner(newOccupant);
		}
	}
	
	this.getPowerUp = function () {
		return powerUp;
	}
	
	this.setPowerUp = function (newPowerUp) {
		powerUp = newPowerUp;
	}
	
	this.hasPowerUp = function () {
		return powerUp !== PowerUp.NONE;
	}
	
	this.getX = function () {
		return x;
	}
	
	this.setX = function (newX) {
		x = newX;
	}
	
	this.getY = function () {
		return y;
	}
	
	this.setY = function (newY) {
		y = newY;
	}
	
	
	/************************
	******* Functions *******
	*************************/
	
	//resets the powerup to none when it is used
	this.powerUpUsed = function () {
		powerUpHit = powerUp;
		powerUp = PowerUp.NONE;
	}
	
	//view the last power up hit without marking it as seen
	this.peakPowerUpHit = function () {
		return powerUpHit;
	}
	
	//view the last power up hit and mark it as seen
	this.seePowerUpHit = function () {
		var powerUpHitReturn = powerUpHit;
		powerUpHit = PowerUp.NONE;
		return powerUpHitReturn;
	}
	
	
}