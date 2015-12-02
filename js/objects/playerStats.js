/*************************************************
	
	keeps track of the stats of a player
	
	NOTE: these stats return the PERCENTAGE (Example: 40 for 40%) but store them as DECIMALS (Example 0.4 for 40%)
	
**************************************************/

PlayerStats = function () {
	
	/***********************
	***** Constructing *****
	************************/

	var highestPercentageCovered = 0;
	var totalPercentageCovered = 0;
	var currentWinStreak = 0;
	var totalGamesPlayed = 0;
	var totalWins = 0;
	
	
	
	/************************
	*** Getters & Setters ***
	*************************/
	
	this.getHighestPercentageCovered = function () {
		return highestPercentageCovered * 100;
	}
	
	this.getCurrentWinStreak = function () {
		return currentWinStreak;
	}
	
	this.getAveragePercentageCovered = function () {
		if (totalGamesPlayed == 0) { return 0; }
		return (totalPercentageCovered / (1.0 * totalGamesPlayed)) * 100;
	}
	
	this.getAverageWinPercentage = function () {
		if (totalGamesPlayed == 0) { return 0; }
		return (totalWins / (1.0 * totalGamesPlayed)) * 100;
	}
	
	this.getTotalWins = function () {
		return totalWins;
	}
	
	
	
	/************************
	******* Functions *******
	*************************/
	
	// this updates our stats given the percentageCovered and isWinner for the last game
	// parameter percentageCovered should be in decimal form
	this.updateStats = function(percentageCovered, isWinner) {
		
		//sanity check
		if (percentageCovered > 1) {
			percentageCovered = percentageCovered / 100.0;
		}
		
		totalGamesPlayed++;
		if (isWinner) {
			totalWins++;
			currentWinStreak++;
		}
		else {
			currentWinStreak = 0;
		}
		
		totalPercentageCovered += percentageCovered;
		if (percentageCovered > highestPercentageCovered) { highestPercentageCovered = percentageCovered; }
		
	}
	
}