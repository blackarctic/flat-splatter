

/************************
***** Manager Tests *****
*************************/

QUnit.module( "Manager Tests" );
				
QUnit.test( "Create Manager", function( assert ) {
	manager = new Manager();
	manager.setNumOfHumanPlayers(1);
	manager.setPlayerColors(SplatterColor.BLUE);
	manager.startNewGame();
  	assert.ok( manager.isGameOver() === false, "Game Isn't Over" );
  	assert.equal( manager.getSecondsRemaining(), manager.getTotalSecondsInGame(), "Seconds Remaining" );
});

QUnit.test( "decrementSecRemaining", function( assert ) {
	manager = new Manager();
	manager.setNumOfHumanPlayers(1);
	manager.setPlayerColors(SplatterColor.BLUE);
	manager.startNewGame();
	manager.decrementSecRemaining();
  	assert.ok( manager.isGameOver() === false, "Game Isn't Over" );
  	assert.equal( manager.getSecondsRemaining(), manager.getTotalSecondsInGame()-1, "Seconds Remaining" );
});

QUnit.test( "decrementSecRemaining", function( assert ) {
	manager = new Manager();
	manager.setNumOfHumanPlayers(1);
	manager.setPlayerColors(SplatterColor.BLUE);
	manager.startNewGame();
	manager.decrementSecRemaining();
  	assert.ok( manager.isGameOver() === false, "Game Isn't Over" );
  	assert.equal( manager.getSecondsRemaining(), manager.getTotalSecondsInGame()-1, "Seconds Remaining" );
});

QUnit.test( "handlePowerUpHit_Shot", function( assert ) {
	manager = new Manager();
	manager.setNumOfHumanPlayers(1);
	manager.setPlayerColors(SplatterColor.BLUE);
	manager.startNewGame();
	
	var board = manager.getBoard();
	var player = manager.getPlayers()[3];
	var boardSpace = player.getBoardSpace();
	
	player.setDirection(Direction.UP);
	manager.handlePowerUpHit(player.getBoardSpace(), player, PowerUp.SHOT);
	
	while (board.spaceExistsAt(boardSpace.getX(), boardSpace.getY()-1)) {
		boardSpace = board.getBoardSpace(boardSpace.getX(),boardSpace.getY()-1);
		assert.equal( boardSpace.getOwner(), player, "Shot Up" );
	}
});

QUnit.test( "handlePowerUpHit_Ring", function( assert ) {
	manager = new Manager();
	manager.setNumOfHumanPlayers(1);
	manager.setPlayerColors(SplatterColor.BLUE);
	manager.startNewGame();
	
	var board = manager.getBoard();
	var player = manager.getPlayers()[2];
	var boardSpace;
	var originalBoardSpace = player.getBoardSpace();
	
	manager.handlePowerUpHit(player.getBoardSpace(), player, PowerUp.RING);
	
	//Directionals
	if (board.spaceExistsAt(originalBoardSpace.getX()+1, originalBoardSpace.getY())) {
		boardSpace = board.getBoardSpace(originalBoardSpace.getX()+1, originalBoardSpace.getY());;
		assert.equal( boardSpace.getOwner(), player, "Ring Right" );
	}
	if (board.spaceExistsAt(originalBoardSpace.getX()-1, originalBoardSpace.getY())) {
		boardSpace = board.getBoardSpace(originalBoardSpace.getX()-1, originalBoardSpace.getY());;
		assert.equal( boardSpace.getOwner(), player, "Ring Left" );
	}
	
	if (board.spaceExistsAt(originalBoardSpace.getX(), originalBoardSpace.getY()+1)) {
		boardSpace = board.getBoardSpace(originalBoardSpace.getX(), originalBoardSpace.getY()+1);;
		assert.equal( boardSpace.getOwner(), player, "Ring Up" );
	}
	if (board.spaceExistsAt(originalBoardSpace.getX(), originalBoardSpace.getY()-1)) {
		boardSpace = board.getBoardSpace(originalBoardSpace.getX(), originalBoardSpace.getY()-1);;
		assert.equal( boardSpace.getOwner(), player, "Ring Down" );
	}
	
	//Diagonals
	if (board.spaceExistsAt(originalBoardSpace.getX()+1, originalBoardSpace.getY()+1)) {
		boardSpace = board.getBoardSpace(originalBoardSpace.getX()+1, originalBoardSpace.getY()+1);;
		assert.equal( boardSpace.getOwner(), player, "Ring Up Right" );
	}
	if (board.spaceExistsAt(originalBoardSpace.getX()-1, originalBoardSpace.getY()-1)) {
		boardSpace = board.getBoardSpace(originalBoardSpace.getX()-1, originalBoardSpace.getY()-1);;
		assert.equal( boardSpace.getOwner(), player, "Ring Down Left" );
	}
	
	if (board.spaceExistsAt(originalBoardSpace.getX()-1, originalBoardSpace.getY()+1)) {
		boardSpace = board.getBoardSpace(originalBoardSpace.getX()-1, originalBoardSpace.getY()+1);;
		assert.equal( boardSpace.getOwner(), player, "Ring Up Left" );
	}
	if (board.spaceExistsAt(originalBoardSpace.getX()+1, originalBoardSpace.getY()-1)) {
		boardSpace = board.getBoardSpace(originalBoardSpace.getX()+1, originalBoardSpace.getY()-1);;
		assert.equal( boardSpace.getOwner(), player, "Ring Down RIght" );
	}
});

QUnit.test( "handlePowerUpHit_Steal", function( assert ) {
	manager = new Manager();
	manager.setNumOfHumanPlayers(1);
	manager.setPlayerColors(SplatterColor.BLUE);
	manager.startNewGame();
	
	var board = manager.getBoard();
	var players = manager.getPlayers();
	var player = players[1];
	var boardSpace = player.getBoardSpace();
	
	manager.handlePowerUpHit(player.getBoardSpace(), player, PowerUp.STEAL);
	
	
	assert.ok( players[0].getBoardSpace().getOwner() === player ||
			   players[2].getBoardSpace().getOwner() === player ||
			   players[3].getBoardSpace().getOwner() === player
	, "Space Stolen" );
});

QUnit.test( "generatePowerUps", function( assert ) {
	manager = new Manager();
	manager.setNumOfHumanPlayers(1);
	manager.setPlayerColors(SplatterColor.BLUE);
	manager.startNewGame();
	
	var powerUpCount = 0;
	
	var board = manager.getBoard();
	for (var x = 0; x < board.getWidth(); x++) {
		for (var y = 0; y < board.getHeight(); y++) {
			if (board.getBoardSpace(x,y).getPowerUp() !== PowerUp.NONE &&
				board.getBoardSpace(x,y).getOwner() === null) {
				powerUpCount++;
			}
		}
	}
	assert.ok( powerUpCount <= 4, "Power Ups Generated" );
});


QUnit.test( "movePlayers", function( assert ) {
	manager = new Manager();
	manager.setNumOfHumanPlayers(1);
	manager.setPlayerColors(SplatterColor.BLUE);
	manager.startNewGame();
	
	var board = manager.getBoard();
	var player = manager.getPlayers()[0];
	var boardSpace;
	
	boardSpace = player.getBoardSpace();
	assert.equal( boardSpace.getX(), board.getBoardSpace(0,0).getX(), "Before Space X" );
	assert.equal( boardSpace.getY(), board.getBoardSpace(0,0).getY(), "Before Space Y" );
	
	player.setDirection(Direction.RIGHT);
	manager.movePlayers();
	
	boardSpace = player.getBoardSpace();
	assert.equal( boardSpace.getX(), board.getBoardSpace(1,0).getX(), "After Space X" );
	assert.equal( boardSpace.getY(), board.getBoardSpace(1,0).getY(), "After Space Y" );
});




/************************
****** Board Tests ******
*************************/

QUnit.module( "Board Tests" );

QUnit.test( "Create Board", function( assert ) {
	var board = new Board();
  	assert.equal( board.getWidth(), 6, "Board Width is 6" );
  	assert.equal( board.getHeight(), 6, "Board Height is 6" );
});

QUnit.test( "spaceExistsAt", function( assert ) {
	var board = new Board();
  	assert.ok( board.spaceExistsAt(-1,0) === false, "Low X" );
  	assert.ok( board.spaceExistsAt(0,-1) === false, "Low Y" );
  	assert.ok( board.spaceExistsAt(0,-1) === false, "Low Both" );
  	assert.ok( board.spaceExistsAt(0,0) === true, "Low in Bounds" );
  	assert.ok( board.spaceExistsAt(board.getWidth()-1,board.getHeight()-1) === true, "High in Bounds" );
  	assert.ok( board.spaceExistsAt(board.getWidth(),0) === false, "High X" );
  	assert.ok( board.spaceExistsAt(0,board.getHeight()) === false, "High Y" );
  	assert.ok( board.spaceExistsAt(board.getWidth(),board.getHeight()) === false, "High Both" );
});

QUnit.test( "isLegalMove", function( assert ) {
	manager = new Manager();
	manager.setNumOfHumanPlayers(1);
	manager.setPlayerColors(SplatterColor.BLUE);
	manager.startNewGame();
	var board = manager.getBoard();
  	assert.ok( board.isLegalMove(board.getWidth()-1,0) === false, "Space Occupied" );
  	assert.ok( board.isLegalMove(board.getWidth()-2,0) === true, "Space Not Occupied" );
});


/************************
*** BoardSpace Tests ****
*************************/

QUnit.module( "BoardSpace Tests" );

QUnit.test( "Create BoardSpace", function( assert ) {
	var boardSpace = new BoardSpace(100,200);
  	assert.equal( boardSpace.hasOwner(), false, "No Owner" );
  	assert.equal( boardSpace.getX(), 100, "X" );
  	assert.equal( boardSpace.getY(), 200, "Y" );
});

QUnit.test( "powerUpHit", function( assert ) {
	var boardSpace = new BoardSpace(100,200);
	boardSpace.setPowerUp(PowerUp.SHOT);
	boardSpace.powerUpUsed();
	assert.equal( boardSpace.getPowerUp(), PowerUp.NONE, "Power Up is None" );
	assert.equal( boardSpace.peakPowerUpHit(), PowerUp.SHOT, "Peaked Power Up Correct" );
	assert.equal( boardSpace.peakPowerUpHit(), PowerUp.SHOT, "Peaked Power Up Does Not Remove It" );
	assert.equal( boardSpace.seePowerUpHit(), PowerUp.SHOT, "See Power Up Correct" );
	assert.equal( boardSpace.peakPowerUpHit(), PowerUp.NONE, "See Power Up Does Remove It" );
});


/************************
***** Player Tests ******
*************************/

QUnit.module( "Player Tests" );

QUnit.test( "Create Player", function( assert ) {
	var boardSpace = new BoardSpace(10,0);
	var player = new Player(0, SplatterColor.GREEN, true, boardSpace);
	
	assert.equal( player.getDirection(), Direction.NONE, "No Direction" );
	player.setDirection(Direction.UP);
  	assert.equal( player.getDirection(), Direction.UP, "Up Direction" );
  	assert.equal( player.isHuman(), true, "Human" );
});

QUnit.test( "reset", function( assert ) {
	var boardSpace1 = new BoardSpace(15,0);
	var boardSpace2 = new BoardSpace(0,3);
	var player = new Player(0, 1, boardSpace1);
	player.setDirection(Direction.UP);
	player.reset(boardSpace2, true, SplatterColor.GREEN);
	
	assert.equal( player.getDirection(), Direction.NONE, "Direction Reset" );
  	assert.equal( player.isHuman(), true, "Human Should be the same" );
  	assert.equal( player.getBoardSpace(), boardSpace2, "Board Space Reset" );
});

QUnit.test( "PersistentPowerUps After Reset", function( assert ) {
	var boardSpace1 = new BoardSpace(15,0);
	var boardSpace2 = new BoardSpace(0,3);
	var player = new Player(0, 1, boardSpace1);
	
	player.setRandomPersistentPowerUp(20);
	
	var powerUp = player.getPersistentPowerUp();
	var powerUpTime = player.getPersistentPowerUpUseTime();
	
	player.reset(boardSpace2, true, SplatterColor.GREEN);
	
	assert.equal( player.getPersistentPowerUp(), powerUp, "Power Up Maintained After Reset" );
  	assert.equal( player.getPersistentPowerUpUseTime(), powerUpTime, "Power Up Time Maintained After Reset" );
});

QUnit.test( "Stats After Reset", function( assert ) {
	var boardSpace1 = new BoardSpace(15,0);
	var boardSpace2 = new BoardSpace(0,3);
	var player = new Player(0, 1, boardSpace1);
	
	player.updateStats(.25, true);
	player.updateStats(75, true);
	
	player.reset(boardSpace2, true, SplatterColor.PURPLE);
	var playerStats = player.getStats();
	
	assert.equal( playerStats.getHighestPercentageCovered(), 75, "Highest Percentage Covered" );
	assert.equal( playerStats.getCurrentWinStreak(), 2, "Win Streak" );
	assert.equal( playerStats.getAveragePercentageCovered(), 50, "Average Percentage Covered" );
	assert.equal( playerStats.getAverageWinPercentage(), 100, "Average Win Percentage" );
});



/*************************
*** Player Stats Tests ***  
**************************/

QUnit.module( "Player Stats Tests" );

QUnit.test( "Create PlayerStats", function( assert ) {
	var playerStats = new PlayerStats();
	
	assert.equal( playerStats.getHighestPercentageCovered(), 0, "No Highest Percentage Covered" );
	assert.equal( playerStats.getCurrentWinStreak(), 0, "No Win Streak" );
	assert.equal( playerStats.getAveragePercentageCovered(), 0, "No Average Percentage Covered" );
	assert.equal( playerStats.getAverageWinPercentage(), 0, "No Average Win Percentage" );
});

QUnit.test( "Get Correct PlayerStats", function( assert ) {
	var playerStats = new PlayerStats();
	
	playerStats.updateStats(.3, 1);
	assert.equal( playerStats.getHighestPercentageCovered(), 30, "Initial Highest Percentage Covered" );
	assert.equal( playerStats.getCurrentWinStreak(), 1, "Initial Win Streak" );
	assert.equal( playerStats.getAveragePercentageCovered(), 30, "Initial Average Percentage Covered" );
	assert.equal( playerStats.getAverageWinPercentage(), 100, "Initial Average Win Percentage" );
	
	playerStats.updateStats(28.9, 1);
	playerStats.updateStats(.5, 0);
	assert.equal( playerStats.getCurrentWinStreak(), 0, "Median Win Streak" );
	assert.equal( playerStats.getHighestPercentageCovered(), 50, "Final Highest Percentage Covered" );
	assert.equal( playerStats.getAveragePercentageCovered(), 36.3, "Final Average Percentage Covered" );
	assert.equal( playerStats.getAverageWinPercentage().toFixed(3), 66.667, "Final Average Win Percentage" );
	
	playerStats.updateStats(.5, 1);
	playerStats.updateStats(.5, 1);
	assert.equal( playerStats.getCurrentWinStreak(), 2, "Final Win Streak" );
});












