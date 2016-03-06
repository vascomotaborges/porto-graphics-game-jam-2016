var enemy_type = ['dude','monster'];
var tower_type = ['tower1', 'tower2'];

function Enemy(x, y, type) {
	// The player and its settings
	this.enemy = game.add.sprite(x, y, type, 0);
	this.enemy.enableBody = true;
  this.dirty = false;
	//  We need to enable physics on the player
	game.physics.arcade.enable(this.enemy);

	//  Player physics properties.
	//this.enemy.anchor.x = 0.5;
	//this.enemy.anchor.y = 1;
	this.enemy.body.gravity.y = 0;
	//player.body.collideWorldBounds = true;

	// define basic walking animation
	this.enemy.animations.add("right", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29], 30, true);
	this.enemy.animations.add("down", [30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59], 30, true);
	this.enemy.animations.add("left", [60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89], 30, true);
	this.enemy.animations.add("up", [90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119], 30, true);

	findPathTo((x/32)|0,(y/32)|0,29,10, (function(path) {
			this.path = path;
	}).bind(this));

	this.update = function() {
		//Check the path
    if(this.dirty) this.updatePath();

    if(this.path) {

      // Got places to go
      if(this.path.length > 0){

        //Next destination
        if(!this.next) {
          this.next = this.path.shift();
          this.next.x *= 32;
          this.next.y *= 32;
        }

        var distx = this.next.x - this.enemy.body.position.x;
        var disty = this.next.y - this.enemy.body.position.y;

        if(Math.abs(distx) < 1 && Math.abs(disty) < 1) {
          this.next = this.path.shift();
          this.next.x *= 32;
          this.next.y *= 32;
          distx = this.next.x - this.enemy.body.position.x;
          disty = this.next.y - this.enemy.body.position.y;
        }

        var dist = 0.03 * Math.sqrt((distx*distx) + (disty*disty));
        this.enemy.body.velocity.x = distx/dist;
        this.enemy.body.velocity.y = disty/dist;

				var direction = getDirection(this.enemy);
				//console.log(direction);
				this.enemy.animations.play(direction);

      } else {
        // Stop

        this.enemy.body.velocity.x = 0;
        this.enemy.body.velocity.y = 0;
      }

    }
	};

	this.updatePath = function() {
    this.dirty = false;
		findPathTo(Math.round((this.enemy.body.position.x)/32),Math.round((this.enemy.body.position.y)/32),29,10, (function(path) {
				console.log(Math.round((this.enemy.body.position.x)/32),Math.round((this.enemy.body.position.y)/32));
				this.path = path;
				this.next = undefined;
		}).bind(this));
	};
}

function createEnemy(x, y, type) {
	var state = game.state.getCurrentState();
	state.enemies.push(new Enemy(x, y, enemy_type[type]));
}

function updateGrid(x, y, value) {
	grid[x][y] = value;
}

function Tower(x, y, type) {

	// The player and its settings
	this.tower = game.add.sprite(x*32, y*32, type, 0);
	this.tower.enableBody = true;

	//  We need to enable physics on the player
	game.physics.arcade.enable(this.tower);

	//  Player physics properties.
	//this.player.anchor.x = 0.5;
	//this.player.anchor.y = 1;
	this.tower.body.gravity.y = 0;
	//player.body.collideWorldBounds = true;

	// define basic walking animation
	this.tower.animations.add("idle", [10], 32, false);
	this.tower.animations.add("walk_left", [24,25,26,27,28,29,30,31], 32, true);
	this.tower.animations.add("walk_right", [16,17,18,19,20,21,22,23], 32, true);
	this.tower.animations.add("walk_up", [0,1,2,3,4], 32, true);
	this.tower.animations.add("walk_down", [8,9,10,11,12], 32, true);

}

function createTower(x, y, type) {

	updateGrid(y, x, 15);
	findPathTo(1,10,29,10, function(path) {
		if(path) {
			var state = game.state.getCurrentState();
			state.towers.push(new Tower(x, y, tower_type[type]));
			state.enemies.forEach(a => {a.dirty = true});
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

function createWave(interval, arr) {
	var timer = game.time.create(false);
	timer.arr = arr;
	timer.loop(interval, function() {
		if(this.arr.length !== 0) createEnemy(0,10*32, arr.shift());
		else this.stop();
	}, timer);
	timer.start();
}
