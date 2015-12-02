/*************************************************
	
	the enumerated type for PowerUps
	
**************************************************/


var PowerUp = {
	NONE : "None",
	SHOT : "Shot",
	RING : "Ring",
	STEAL: "Steal",
	
	random : function () {
		var randPU = Math.floor((Math.random() * 3)+1); // random number between 1 and 3
		switch (randPU) {
			case 1:
				return this.SHOT;
				break;
			case 2:
				return this.STEAL;
				break;
			case 3:
				return this.RING;
				break;
			default:
				return this.RING; //to avoid errors
		}
	}
}