function API(app_id,server){
	this.app_id = app_id;
	this.name = server;
	this.server = 'http://' + server + '.3ddg.net';
	this.img = '..';
	this.icon = this.img + '/img/icon';
	this.picture = this.img + '/img/picture';
	this.symbol = this.img + '/img/symbol';
}
function setLoader(src){
	var img = new Image();
	img.src = src;
	if(loader[src] || img.complete)
		return img;
	loader[src] = false;
	$(img).load(function(){
		loader[this.src] = true;
	});
	return img;
}
function controller(keyCode){
	//if(!$('#notice:animated').length)
	//	$('#notice:visible').fadeOut(500);
	/*if(keyCode == '32'){
	}
	if(forward = local.move(keyCode)){
		local.forward(keyCode);
	}else if(keyCode == '38' || keyCode == '40'){
	}else{
	}*/
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

var api = new API('33996','m99');
var scene = new Scene(18);
var camera;

var canvas, ctx;
var canvasWidth, halfCanvasWidth;
var canvasHeight, halfCanvasHeight;
var readyCanvas/*,readyImage*/;
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
    readyCanvas = true;
    sd = setInterval('scene.draw()',1000 / scene.fps);
	//scene.draw();
}

$(function(){
	xcanvas();
	/*map = new Map(maps['29'].symbols,maps['29'].detail,null,'29');
	var start = map.symbols['start'];
	var self = new Symbol('self',{
		name: 'self',
		//src: api.picture + '/dummy',
		//src: 'dummy',
		x: start.x,
		y: start.y - 0,
		z: start.z - 0,
		d: start.d - 0,
		size_x: 0,
		size_y: 0,
		pos_y: 0,
		alg: 'selfAlg'
	});
	map.symbols['self'] = self;
	local = map.symbols.self.location;
	scene.location = map.symbols.self.location;
	scene.map = map;*/
	
	scene.camera = new Camera(0,9.8,0,0,0,2.5);
	camera = scene.camera;
	camera.v.z = 0;

	$(document).keydown(function(e){
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
	});

    sf = setInterval('scene.forward()',1000 / scene.fps);
    
    $('button').eq(1).click(function(){
    		clearInterval(sf);
    		clearInterval(sd);
    });
	
    $('button').eq(0).click(function(){
		clearInterval(sf);
		clearInterval(sd);
    		sf = setInterval('scene.forward()',1000 / scene.fps);
		sd = setInterval('scene.draw()',1000 / scene.fps);
    });

    $('button').eq(2).click(function(){
		clearInterval(sf);
		clearInterval(sd);
		scene.camera = new Camera(0,9.8,0,0,0,2.5);
		camera = scene.camera;
		camera.v.z = 0;
        sf = setInterval('scene.forward()',1000 / scene.fps);
        sd = setInterval('scene.draw()',1000 / scene.fps);
		//xcanvas();
    });

});
