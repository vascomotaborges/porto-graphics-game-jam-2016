var game = new Phaser.Game(960, 640, Phaser.AUTO, '');

var pathfinder;
var grid;
var map;
var hud;

function HUDLayer() {
  hud = game.add.group();
  hud.activeBtn = null;

  hud.create(game.width/2, game.height - 60, 'button1');
  hud.forEach(function(btn){ btn.inputEnabled = true });

  hud.update = function(){
    hud.forEach(function(btn){
      if(btn.input.pointerDown()){
        hud.activeBtn = hud.getIndex(btn)+1;
      }
    });
  }
  return hud;
}

function findPathTo(startx, starty, endx, endy, callback) {
	pathfinder.setGridMatrix(grid);
	pathfinder.setCallbackFunction(callback);
	pathfinder.preparePathCalculation([startx, starty], [endx, endy]);
	pathfinder.calculatePath();
}
