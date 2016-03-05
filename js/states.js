
function boot() {
	return {
		create: function() {
			pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
			game.stage.backgroundColor = '#FFFF00';
			game.physics.startSystem(Phaser.Physics.ARCADE);
			setTimeout(function() {game.state.start('level1');}, 1000);
		},
	};
}

function level1() {
	return {
		map: {},
		enemies: [],
		towers: [],
		preload: function () {

	    game.load.tilemap('map1', 'data/maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
	    game.load.image('tiles', 'data/images/tile2map32.png');
			game.load.image('background', 'data/images/FR_Grasslands.png');

			game.load.spritesheet('dude', 'data/images/skull_360.png', 30, 30);
      game.load.spritesheet('monster', 'data/images/monster.png', 32, 32);
			game.load.spritesheet('tower', 'data/images/square.png', 32, 32);

		},

		create: function () {

	    //game.stage.backgroundColor = '#787878';

	    //  The 'map' key here is the Loader key given in game.load.tilemap
	    this.map = game.add.tilemap('map1');
			map = this.map;

			grid = pathfinder.setGrid(this.map.layers[0].data, [-1]);

	    //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
	    //  The second parameter maps this name to the Phaser.Cache key 'tiles'
	    this.map.addTilesetImage('forest', 'tiles');

	    //  Creates a layer from the World1 layer in the map data.
	    //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
			game.add.sprite(0, 0, 'background');
	    layer = this.map.createLayer('map');


			createEnemy(0, 10*32, 0);

	    //  This resizes the game world to match the layer dimensions
	    //layer.resizeWorld();

		},

		update: function () {
			this.enemies.forEach(a => a.update());
		}
	};
}

game.state.add('boot', boot());
game.state.add('level1', level1());
game.state.start('boot');
