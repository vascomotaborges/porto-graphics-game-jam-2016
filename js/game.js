'use strict';

const TILEWIDTH = 48;
const TILEHEIGHT = 48;

var game = new Phaser.Game(1280, 720, Phaser.AUTO, '');

var pathfinder;
var grid;
var hud;
var lives = 3;
var score = 0;

function HUDLayer() {
  hud = game.add.group();
  hud.activeBtn = null;
  hud.create(game.width/2 - 175 - 30 - 83, game.height - 110, 'button1');
  hud.create(game.width/2 - 83, game.height - 110, 'button2');
  hud.create(game.width/2 + 30 + 83, game.height - 110, 'button3');
  hud.forEach(function(btn){ 
    btn.inputEnabled = true;
    btn.animations.add("normal", [0], 30, true);
    btn.animations.add("active", [1], 30, true);
  });

  hud.update = function(){
  	let hudClicked = false;
    hud.forEach(function(btn){
      if(btn.input.pointerDown()){
      	hudClicked = true;
        hud.activeBtn = hud.getIndex(btn);
        hud.forEach(function(btn){
          btn.animations.play("normal");
        });
        btn.animations.play("active");
      }
    });
    if(!hudClicked){
    	if(hud.activeBtn != null && game.input.activePointer.leftButton.isDown){
	    	var posx = Math.round((game.input.activePointer.position.x-TILEWIDTH/2)/TILEWIDTH);
        var posy = Math.round((game.input.activePointer.position.y-TILEHEIGHT/2)/TILEHEIGHT);
	    	createTower(posx, posy, hud.activeBtn);
	    }
    }
  }
  return hud;
}

function findPathTo(startx, starty, endx, endy, callback) {
	pathfinder.setGridMatrix(grid);
	pathfinder.setCallbackFunction(callback);
	pathfinder.preparePathCalculation([startx, starty], [endx, endy]);
	pathfinder.calculatePath();
}
