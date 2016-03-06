'use strict';

function boot() {
	return {
		preload: function () {
			game.load.spritesheet('dude', 'data/images/skull_360.png', TILEWIDTH, TILEHEIGHT);
      		game.load.spritesheet('monster', 'data/images/monster.png', TILEWIDTH, TILEHEIGHT);

			game.load.spritesheet('button1', 'data/images/button1.png', 175, 113);
			game.load.spritesheet('tower1', 'data/images/tower1.png', TILEWIDTH, TILEHEIGHT);
			game.load.spritesheet('button2', 'data/images/button2.png', 175, 113);
			game.load.spritesheet('tower2', 'data/images/tower2.png', TILEWIDTH, TILEHEIGHT);
			game.load.spritesheet('button3', 'data/images/button3.png', 175, 113);
			//game.load.spritesheet('tower2', 'data/images/tower2.png', TILEWIDTH, TILEHEIGHT);
	    },
		create: function() {
			pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
			game.stage.backgroundColor = '#CCCCCC';
			game.physics.startSystem(Phaser.Physics.ARCADE);
			setTimeout(function() {game.state.start('logo');}, 1000);
		},
	};
}

var x;

class RevealText extends Phaser.BitmapText {
	constructor(game, x, y, font, text, size, delay, align) {
		super(game, x, y, font, '', size, align);
		this.all_text = text;
		this.delay = delay;
		this.current_delay = 0;
		this.current_char = 0;
		game.add.existing(this);
	}

	update() {
		if(this.current_delay == this.delay) {
			this.current_delay = 0;
			this.current_char += 1;

			this.text = this.all_text.slice(0, this.current_char);
			if(this.current_char == this.all_text.length) {
				this.onfinish();
			}
		} else {
			this.current_delay += 1;
		}
	}

	onfinish() {
		console.log("the end!");
		this.update = function() {}
		game.state.start('level1');
	}
}

function logo() {
	return {
		preload: function () {
			game.load.image('logo', 'data/images/grid.png');
		},

		create: function() {
			game.add.sprite(0, 0, 'logo');
			setTimeout(function() {
				game.state.start('intro')
			},2000)
		},
	};
}

function intro() {
	return {
		preload: function () {
			game.load.bitmapFont('font', 'data/images/font4.png', 'data/images/font4.fnt');
		},

		create: function() {
			game.stage.backgroundColor = '#111111';

			var text = `The world was about to come to an end...

The evil guy, sent his minions to kidnap the beautiful princess!

This is the story of an architect prince,
building twisted towers to defende his princess!                        `;
			x = new RevealText(game, 250, 100, 'font', text, 16, 5);
			x.tint = 0xEEEE00;
		},
		update: function() {
	    	x.update();
		}
	};
}

function level1() {
	return {
		map: {},
		enemies: undefined,
		towers: undefined,
		startTile: {x:2 , y:7},
		endTile: {x:24 , y:7},
		preload: function () {
	    	game.load.tilemap('map1', 'data/maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
	    	game.load.image('ground', 'data/images/level_1.png');
	    	game.load.image('grid', 'data/images/grid.png');
	    	game.load.image('cover', 'data/images/cover.png');
		},

		create: function () {

	    //game.stage.backgroundColor = '#787878';
		    //  The 'map' key here is the Loader key given in game.load.tilemap
		    this.map = game.add.tilemap('map1');

			grid = pathfinder.setGrid(this.map.layers[0].data, [-1]);

	    //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
	    //  The second parameter maps this name to the Phaser.Cache key 'tiles'
		  this.map.addTilesetImage('grid', 'grid');

		    //  Creates a layer from the World1 layer in the map data.
		    //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
			game.add.sprite(0, 0, 'ground');
	    this.map.createLayer('grid');

			this.enemies = game.add.group();
			this.towers = game.add.group();

		  //This resizes the game world to match the layer dimensions
		  //layer.resizeWorld();

		  game.add.sprite(0, 0, 'cover');

			hud = new HUDLayer();
		},

	    render: function(){
	      game.debug.text(this.enemies.length, 30,30 );
	      //game.debug.text("Mouse y: " + game.input.activePointer.position.y, 300, 112);
	      //game.debug.text("Left Button: " + game.input.activePointer.leftButton.isDown, 300, 132);
	      game.debug.text(lives, 884, 43);
	    },

		update: function () {
			if(lives<=0) setTimeout(function() {game.state.start('gameover');}, 1000);
		}
	};
}


function gameover() {
	return {
		create: function() {
			game.stage.backgroundColor = '#00FFFF';
		},
	};
}


game.state.add('boot', boot());
game.state.add('logo', logo());
game.state.add('intro', intro());
game.state.add('level1', level1());
game.state.add('gameover', gameover());
game.state.start('boot');
