function Dude(x, y) {
	// The player and its settings
	this.player = game.add.sprite(x, y, 'dude', 0);
	this.player.enableBody = true;

	//  We need to enable physics on the player
	game.physics.arcade.enable(this.player);

	//  Player physics properties.
	//this.player.anchor.x = 0.5;
	//this.player.anchor.y = 1;
	this.player.body.gravity.y = 0;
	//player.body.collideWorldBounds = true;

	// define basic walking animation
	this.player.animations.add("right", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29], 60, true);
	this.player.animations.add("down", [30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59], 60, true);
	this.player.animations.add("left", [60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89], 60, true);
	this.player.animations.add("up", [90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119], 60, true);

	findPathTo((x/32)|0,(y/32)|0,29,10, (function(path) {
			this.path = path;
	}).bind(this));

	this.update = function() {
		//Check the path
    if(this.path) {

      // Got places to go
      if(this.path.length > 0){

        //Next destination
        if(!this.next) {
          this.next = this.path.shift();
          this.next.x *= 32;
          this.next.y *= 32;
        }

        var distx = this.next.x - this.player.body.position.x;
        var disty = this.next.y - this.player.body.position.y;

        if(Math.abs(distx) < 1 && Math.abs(disty) < 1) {
          this.next = this.path.shift();
          this.next.x *= 32;
          this.next.y *= 32;
          distx = this.next.x - this.player.body.position.x;
          disty = this.next.y - this.player.body.position.y;
        }

        var dist = 0.01 * Math.sqrt((distx*distx) + (disty*disty));
        this.player.body.velocity.x = distx/dist;
        this.player.body.velocity.y = disty/dist;

				var direction = getDirection(this.player);
				//console.log(direction);
				this.player.animations.play(direction);

      } else {
        // Stop

        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

      }

    }
	};

	this.updatePath = function() {
		findPathTo(Math.round((this.player.body.position.x)/32),Math.round((this.player.body.position.y)/32),29,10, (function(path) {
				console.log(Math.round((this.player.body.position.x)/32),Math.round((this.player.body.position.y)/32));
				this.path = path;
				this.next = undefined;
		}).bind(this));
	};
}

function createDude(x, y) {
	var state = game.state.getCurrentState();
	state.dudes.push(new Dude(x, y));
}

function updateGrid(x, y, value) {
	grid[x][y] = value;
}

function Tower(x, y) {

	// The player and its settings
	this.player = game.add.sprite(x*32, y*32, 'tower', 0);
	this.player.enableBody = true;

	//  We need to enable physics on the player
	game.physics.arcade.enable(this.player);

	//  Player physics properties.
	//this.player.anchor.x = 0.5;
	//this.player.anchor.y = 1;
	this.player.body.gravity.y = 0;
	//player.body.collideWorldBounds = true;

	// define basic walking animation
	this.player.animations.add("idle", [10], 32, false);
	this.player.animations.add("walk_left", [24,25,26,27,28,29,30,31], 32, true);
	this.player.animations.add("walk_right", [16,17,18,19,20,21,22,23], 32, true);
	this.player.animations.add("walk_up", [0,1,2,3,4], 32, true);
	this.player.animations.add("walk_down", [8,9,10,11,12], 32, true);

}

function createTower(x, y) {

	updateGrid(y, x, 15);
	findPathTo(1,10,29,10, function(path) {
		if(path) {
			var state = game.state.getCurrentState();
			state.towers.push(new Tower(x, y));
			state.dudes.forEach(a => a.updatePath());
		} else {
			updateGrid(y, x, -1);
			console.log("UNABLE TO COMPLY, BUILDING IN PROGESS");
		}
	});

}

function getDirection(player) {
	var x = player.body.velocity.x;
	var y = player.body.velocity.y;
	if(x*x > y*y) {
		return (x>0) ? 'right' : 'left';
	} else {
		return (y>0) ? 'down' : 'up';
	}

}

function createWave(n, interval) {
	var timer = game.time.create(false);
	timer.n = n;
	timer.loop(interval, function() {
		console.log(this);
		if(this.n-- !== 0) createDude(0,10*32);
		else this.stop();
	}, timer);
	timer.start();
}
