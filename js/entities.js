var enemy_type = ['dude','monster'];
var tower_type = ['tower1', 'tower2'];

function Enemy(x, y, type) {
	var enemy = game.add.sprite(x, y, type, 0);

	//  We need to enable physics on the player
	game.physics.arcade.enable(enemy);

	enemy.enableBody = true;
  enemy.dirty = false;


	//  Player physics properties.
	//this.enemy.anchor.x = 0.5;
	//this.enemy.anchor.y = 1;
	enemy.body.gravity.y = 0;
	//player.body.collideWorldBounds = true;

	// define basic walking animation
	enemy.animations.add("right", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29], 30, true);
	enemy.animations.add("down", [30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59], 30, true);
	enemy.animations.add("left", [60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89], 30, true);
	enemy.animations.add("up", [90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119], 30, true);

	var state = game.state.getCurrentState();
	findPathTo((x/TILEWIDTH)|0,(y/TILEHEIGHT)|0,state.endTile.x,state.endTile.y, (function(path) {
			this.path = path;
	}).bind(enemy));

	enemy.update = function() {
		//Check the path
    if(this.dirty) this.updatePath();

    if(this.path) {

      // Got places to go
      if(this.path.length > 0){

        //Next destination
        if(!this.next) {
          this.next = this.path.shift();
          this.next.x *= TILEWIDTH;
          this.next.y *= TILEHEIGHT;
        }

        var distx = this.next.x - this.body.position.x;
        var disty = this.next.y - this.body.position.y;

        if(Math.abs(distx) < 1 && Math.abs(disty) < 1) {
          this.next = this.path.shift();
          this.next.x *= TILEWIDTH;
          this.next.y *= TILEHEIGHT;
          distx = this.next.x - this.body.position.x;
          disty = this.next.y - this.body.position.y;
        }

        var dist = 0.03 * Math.sqrt((distx*distx) + (disty*disty));
        this.body.velocity.x = distx/dist;
        this.body.velocity.y = disty/dist;

				var direction = getDirection(this);
				//console.log(direction);
				this.animations.play(direction);

      } else {
        // Stop

        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
      }

    }
	};

	enemy.updatePath = function() {
		this.dirty = false;
		var state = game.state.getCurrentState();
		findPathTo(Math.round((this.body.position.x)/TILEWIDTH),Math.round((this.body.position.y)/TILEHEIGHT),state.endTile.x,state.endTile.y, (function(path) {
				this.path = path;
				this.next = undefined;
		}).bind(this));
	};

	return enemy;
}

function createEnemy(x, y, type) {
	var state = game.state.getCurrentState();
	state.enemies.add(Enemy(x, y, enemy_type[type]));
}

function updateGrid(x, y, value) {
	grid[x][y] = value;
}

function Tower(x, y, type) {
	var tower = game.add.sprite(x*TILEWIDTH+TILEWIDTH/2, y*TILEHEIGHT+TILEHEIGHT/2, type, 0);
	console.log(x*TILEWIDTH + ' ' + y*TILEHEIGHT);
	tower.enableBody = true;
	tower.anchor  = {x:0.5, y:0.5};

	//  We need to enable physics on the player
	game.physics.arcade.enable(tower);

	//  Player physics properties.
	//this.player.anchor.x = 0.5;
	//this.player.anchor.y = 1;
	tower.body.gravity.y = 0;
	//player.body.collideWorldBounds = true;

	// define basic walking animation
  tower.animations.add("idle", [10], 32, false);
	tower.animations.add("walk_left", [24,25,26,27,28,29,30,31], 32, true);
	tower.animations.add("walk_right", [16,17,18,19,20,21,22,23], 32, true);
	tower.animations.add("walk_up", [0,1,2,3,4], 32, true);
	tower.animations.add("walk_down", [8,9,10,11,12], 32, true);

	tower.update = function() {
		this.rotation += 0.05;
	}

	this.findEnemiesInRange = function(enemys) {

	}

	return tower;

}

function createTower(x, y, type) {
	var state = game.state.getCurrentState();
	if(grid[y][x] == -1 && !(x==state.startTile.x && y==state.startTile.y) && !(x==state.endTile.x && y==state.endTile.y)){
		updateGrid(y, x, 15);
		findPathTo(state.startTile.x,state.startTile.y,state.endTile.x,state.endTile.y, function(path) {
			if(path) {
				state.towers.add(Tower(x, y, tower_type[type]));
				state.enemies.forEach(a => {a.dirty = true});
			} else {
				updateGrid(y, x, -1);
				console.log("UNABLE TO COMPLY, BUILDING IN PROGESS");
			}
		});
	} else {
		console.log("UNABLE TO COMPLY, NOT ENOUGH RESOURCES");
	}
}

function getDirection(sprite) {
	var x = sprite.body.velocity.x;
	var y = sprite.body.velocity.y;
	if(x*x > y*y) {
		return (x>0) ? 'right' : 'left';
	} else {
		return (y>0) ? 'down' : 'up';
	}

}

function createWave(interval, arr) {
	var timer = game.time.create(false);
	timer.arr = arr;
	var state = game.state.getCurrentState();
	timer.loop(interval, function() {
		if(this.arr.length !== 0) createEnemy(state.startTile.x*TILEWIDTH,state.startTile.y*TILEHEIGHT, arr.shift());
		else this.stop();
	}, timer);
	timer.start();
}
