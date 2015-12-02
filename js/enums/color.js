/*************************************************
	
	the enumerated type for Colors of Splatter
	
**************************************************/

var SplatterColor = {
	BLUE : 0,
	GREEN : 1,
	PINK : 2,
	PURPLE: 3,
	
	//takes an array of colors that cannot be the return value
	randomExcluding : function (excludeColors) {
		
		var ok = false;
		var choice;
		
		while (!ok) {
			
			ok = true;
			var randomC = Math.floor(Math.random() * 4); // random number between 0 and 3
			switch (randomC) {
				case 0:
					choice = this.BLUE;
					break;
				case 1:
					choice = this.GREEN;
					break;
				case 2:
					choice = this.PINK;
					break;
				case 3:
					choice = this.PURPLE;
					break;
				default:
					choice = this.BLUE; //to avoid errors
			}
			
			if (excludeColors) {
				for (var colorIndex=0; colorIndex < excludeColors.length; colorIndex++) {
					if (choice === excludeColors[colorIndex]) {
						ok = false;
						break;
					}
				}
			}
		}
		
		return choice;
	},

	next : function (color) {
		var newColor = (color + 1) % 4;
		return newColor;
	},
	
	//takes a color and an array of colors to exclude
	//returns the next color that is not in excludeColors
	nextExcluding : function (color, excludeColors) {
		var ok = false;
		while (!ok) {
			ok = true;
			color = this.next(color);
			if (!excludeColors) { break; }
			for (var colorIndex = 0; colorIndex < excludeColors.length; colorIndex++) {
				if (color === excludeColors[colorIndex]) {
					ok = false;
					break;
				}
			}
		}
		return color;
	},
	
	prev : function (color) {
		var newColor = (color + 3) % 4;
		return newColor;
	},
	
	//takes a color and an array of colors to exclude
	//returns the prev color that is not in excludeColors
	prevExcluding : function (color, excludeColors) {
		var ok = false;
		while (!ok) {
			ok = true;
			color = this.prev(color);
			if (!excludeColors) { break; }
			for (var colorIndex = 0; colorIndex < excludeColors.length; colorIndex++) {
				if (color === excludeColors[colorIndex]) {
					ok = false;
					break;
				}
			}
		}
		return color;
	}
}