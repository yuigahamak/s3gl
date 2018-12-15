/*
 * 視点情報(camera)を持つ
 * 描画するべきshapeを探す
 * shapeを描画する
 */
function Scene(fps){
	this.fps = fps || 15;
	this.countPolygon = 0;
	this.shape = [];
	this.polygons = [];
	var shape;
	shape = new Shape({
		x: 0,
		y: 3,
		z: 25,
		sx: 2,
		sy: 3,
		sz: 2,
		rx: 45,
		ry: 45,
		rz: 45,
		type: 'model',
		vertexes: tddata.tprism.vertexes,
		polys: tddata.tprism.polygons
	});
	this.shape.push(shape);
	for(var i = 0; i < 200; i++){
		shape = new Shape({
			x: 18 - Math.random() * 36,
			y: 0 + Math.random() * 15,
			z: -1 + Math.random() * 200,
			//rad: 0,
			sx: Math.random() * 2,
			sy: Math.random() * 2,
			sz: Math.random() * 2,
			rx: Math.floor(Math.random() * 90),
			ry: Math.floor(Math.random() * 90),
			rz: Math.floor(Math.random() * 90),
			color: [
				120 + Math.floor(Math.random() * 100),
				120 + Math.floor(Math.random() * 100),
				120 + Math.floor(Math.random() * 100)
			],
			type: 'cube'
		});
		this.shape.push(shape);
	}
	for(var i = 0; i < 15; i++){
		shape = new Shape({
			x: 0 - Math.random() * 6 + 3,
			y: -1.5,
			z: -1 + i * 13,
			//rad: 0,
			sx: 20,
			sy: 0.1,
			sz: 20,
			ry: -20 + Math.floor(Math.random() * 40),
			color: [
				120 + Math.floor(Math.random() * 100),
				120 + Math.floor(Math.random() * 100),
				120 + Math.floor(Math.random() * 100)
			],
			type: 'cube'
		});
		this.shape.push(shape);
	}
	/*for(var i = 0; i < 400; i++){
		var shape = new Shape({
			x: 4 + Math.random() * 16,
			y: 2 + Math.random() * 1.5,
			z: 0 - Math.random() * 16 + 8,
			rad: 0,
			size: 0.1 + Math.random() * 0.2,
			color: [100 + Math.floor(Math.random() * 100),100 + Math.floor(Math.random() * 100),100 + Math.floor(Math.random() * 100)],
			type: 'cube'
		});
		this.shape.push(shape);
	}*/
}
Scene.prototype.draw = function(){
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	//var data = map.data;
	var shape;
	this.polygons = [];
	for(var j = 0; j < this.shape.length; j++){
		shape = this.shape[j];
		shape.fix(this.camera);
		for(var i = 0; i < shape.polygons.length; i++)
			if(shape.polygons[i].visible == true)
				this.polygons.push(shape.polygons[i]);
	}
	this.polygons.sort(function(a,b){//距離順に並べ替え
		return Math.max.apply(null, b.dist) - Math.max.apply(null, a.dist);
	});
	this.countPolygon = 0;
	for(var i = 0; i < this.polygons.length; i++){
		this.polygons[i].draw();
		this.countPolygon++;
	}
	//fc++;
	//$('#info').html(fc++);
	//$('#count').html(this.countPolygon);

};
Scene.prototype.forward = function(){
	//this.shape[0].v.z += 0.3;
	//this.shape[0].v.y += 0.3;
	this.shape[0].rotate(3,3,3,true);
	this.shape[0].forward(this.fps);
	/*for(var i = 0; i < 200; i+=3){
		this.shape[i].rotate(0,0,7,true);
	}
	for(var i = 0; i < 200; i+=4){
		this.shape[i].rotate(0,7,0,true);
	}*/
	/*for(var i = 3; i < 200; i+=22){
		this.shape[i].direction(60 / this.fps, 0, true);
		this.shape[i].forward(this.fps);
	}
	for(var i = 1; i < 200; i+=22){
		this.shape[i].direction(0, 60 / this.fps, true);
		this.shape[i].forward(this.fps);
	}*/
	/*for(var i = 1; i < 200; i+=9){
		if(this.shape[i].y <= -1.5){
			this.shape[i].y = -1.5;
			this.shape[i].v.y = -this.shape[i].v.y;
			//this.shape[i].v.y = -this.shape[i].v.y/2;
		}
		else
			this.shape[i].v.y -= (9.8 / this.fps);
		this.shape[i].forward(this.fps);
	}*/
	//$('#info').html('y: ' + this.shape[1].y + ' v: ' + this.shape[1].v.y);
	if(this.camera.y <= 0){
		this.camera.y = 0;
		this.camera.v.y = 12;
	}
	else
		this.camera.v.y -= 9.8 / this.fps;
	this.camera.forward(this.fps);
	/*else{
		this.camera.direction(10 / this.fps, 0, true);
		//this.camera.y-=0.1;
	}*/
	//this.camera.zoom -= 0.15;
	//this.camera.zoom = this.camera.zoom < 2.5 ? 2.5 : this.camera.zoom;

	/*this.shape[0].drc = (this.shape[0].x > 10) ? -1
	: (this.shape[0].x < -10) ? 1 : this.shape[0].drc;
	this.shape[0].x += this.shape[0].drc < 0 ? -0.5 : 0.5;

	this.shape[1].drc = (this.shape[1].y > 5) ? -1
	: (this.shape[1].y < -5) ? 1 : this.shape[1].drc;
	this.shape[1].y += this.shape[1].drc < 0 ? -0.5 : 0.5;

	this.shape[2].drc = (this.shape[2].z > 20) ? -1
	: (this.shape[2].z < 0) ? 1 : this.shape[2].drc;	
	this.shape[2].z += this.shape[2].drc < 0 ? -0.5 : 0.5;*/
}
