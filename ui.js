function controller(keyCode){
	if(keyCode == '38'){
		//camera.forward(0.5);
		camera.v.z += 3;
	}
	if(keyCode == '40'){
		//camera.forward(-0.5);
		camera.v.z -= 3;
	}
	if(keyCode == '37'){
		camera.direction(-2,0,true);
	}
	if(keyCode == '39'){
		camera.direction(2,0,true);
	}
	if(keyCode == '59' || keyCode == '186'){
		//camera.direction(0,2,true);
		camera.y+=0.1;
	}
	if(keyCode == '190'){
		//camera.direction(0,-2,true);
		camera.y-=0.1;
	}
	//scene.draw();
}

var scene = new Scene(60);
var camera;

var canvas, ctx;
var canvasWidth, halfCanvasWidth;
var canvasHeight, halfCanvasHeight;
var unitWidth = 210, unitHeight = 210;
var distance = 0.5;

var loader = {};
var map,local;
var sd,sf;//interval
var fc = 0;//frame count

function xcanvas(){
	canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	halfCanvasWidth = canvasWidth * 0.5;
	halfCanvasHeight = canvasHeight * 0.5;
    sd = setInterval('scene.draw()',1000 / scene.fps);
}

(function(){
  xcanvas();
  scene.camera = new Camera(0,9.8,0,0,0,2.5);
  camera = scene.camera;
  camera.v.z = 0;

  document.onkeydown = function(e){
    if(
        e.keyCode == '32'
     || e.keyCode == '37'
     || e.keyCode == '38'
     || e.keyCode == '39'
     || e.keyCode == '40'
     || e.keyCode == '59'
     || e.keyCode == '186'
     || e.keyCode == '190'
  	){
      //$('#controller:visible').fadeOut('fast');
      controller(e.keyCode);
      //$('#info').append('<br />rad: ' + local.rad + ' x: ' + local.x + ' y: ' + local.y + ' z: ' + local.z);
      return false;
    }
  };

  sf = setInterval('scene.forward()',1000 / scene.fps);
  
  var stop = document.querySelector('button:nth-of-type(2)');
  stop.onclick = function(){
    clearInterval(sf);
    clearInterval(sd);
  };
  
  var start = document.querySelector('button:nth-of-type(1)');
  start.onclick = function(){
    clearInterval(sf);
    clearInterval(sd);
    sf = setInterval('scene.forward()',1000 / scene.fps);
    sd = setInterval('scene.draw()',1000 / scene.fps);
  };

  var reset = document.querySelector('button:nth-of-type(3)');
  reset.onclick = function(){
    clearInterval(sf);
    clearInterval(sd);
    scene.camera = new Camera(0,9.8,0,0,0,2.5);
    camera = scene.camera;
    camera.v.z = 0;
    sf = setInterval('scene.forward()',1000 / scene.fps);
    sd = setInterval('scene.draw()',1000 / scene.fps);
  };
}())
