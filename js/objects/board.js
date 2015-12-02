/*************************************************
	
	the Board holds the boardSpaces and other relevant functions
	
**************************************************/

Board = function () {
	
	/***********************
	***** Constructing *****
	************************/
	
	var width = 6;
	var height = 6;
	
	//create the boardSpaces[x][y]
	var boardSpaces = [];
	for (var x = 0; x < width; x++) {
		boardSpaces[x] = [];
		for (var y = 0; y < height; y++) {
			boardSpaces[x][y] = new BoardSpace(x,y);
		}
	}
	
	
	

	/************************
	*** Getters & Setters ***
	*************************/
	
	this.getWidth = function () {
		return width;
	}
	
	this.getHeight = function () {
		return height;
	}
	
	this.getBoardSpace = function(x, y) {
		return boardSpaces[x][y];
	}
	
	
	
	/************************
	******* Functions *******
	*************************/
	
	//simply checks if coords are in bound
	this.spaceExistsAt = function(x, y) {
		if (x < 0 || x > width-1 || y < 0 || y > height-1) {
			return false;
		}
		return true;
	}
	
	//space by these coords must be in bounds and not occupied by another player to be legal
	this.isLegalMove = function (x, y) {
		if (!this.spaceExistsAt(x,y)) {
			return false;
		}
		if (boardSpaces[x][y].isOccupied()){
			return false;
		}
		return true;
	}
	
	
}