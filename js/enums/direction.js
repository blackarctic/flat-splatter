/*************************************************
	
	the enumerated type for Direction
	
**************************************************/

var Direction = {
	NONE : 0,
	UP : 1,
	DOWN : 2,
	LEFT: 3,
	RIGHT : 4,
	
	random : function () {
		var randomD = Math.floor((Math.random() * 4)+1); // random number between 1 and 4
		switch (randomD) {
			case 1:
				return this.UP;
				break;
			case 2:
				return this.DOWN;
				break;
			case 3:
				return this.LEFT;
				break;
			case 4:
				return this.RIGHT;
				break;
			default:
				return this.UP; //to avoid errors
		}
	}
}