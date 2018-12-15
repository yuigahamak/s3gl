/*
 * 位置情報を持つ
 * 形状情報（複数のポリゴン）を持つ
 * 形状指定してポリゴン生成機能（cubeとか）
 * 頂点情報を持つ vertex
 * vertexとpolygon.pointsはリンク
 */
function Shape(param) {
	this.type = param.type || 'cube';
	this.proto = [];//prototype 原型
	this.vertex = [];
	this.polygons = [];
	this.x = param.x || 0;
	this.y = param.y || 0;
	this.z = param.z || 0;
	//this.rx = param.rx / 180 * Math.PI || 0;
	//this.ry = param.ry / 180 * Math.PI || 0;
	//this.rz = param.rz / 180 * Math.PI || 0;
	this.rx = param.rx || 0;
	this.ry = param.ry || 0;
	this.rz = param.rz || 0;
	this.sx = param.sx || 1;
	this.sy = param.sy || 1;
	this.sz = param.sz || 1;
	this.color = param.color || [0,0,0];
	this.v = {x: 0, y: 0, z: 0};
	this[this.type](param.vertexes,param.polys);
	//this.setPolygon();
	if(this.rx || this.ry || this.rz)
		this.rotate(this.rx || 0,this.ry || 0,this.rz || 0);
}
Shape.prototype = new Location();
Shape.prototype.fix = function(camera){
	var polygon,p;
	for(var i = 0; i < this.polygons.length; i++){
		polygon = this.polygons[i];
		for(var j = 0; j < polygon.points.length; j++){
			p = polygon.points[j];
			polygon.p[j] = {
				x: p.x + this.x,
				y: p.y + this.y,
				z: p.z + this.z
			};
		}
		polygon.fix(camera);
	}
}
Shape.prototype.rotate = function(x,y,z,diff) {
	x = x / 180 * Math.PI;
	y = y / 180 * Math.PI;
	z = z / 180 * Math.PI;
	this.rx = diff ? this.rx + x : x;
	this.ry = diff ? this.ry + y : y;
	this.rz = diff ? this.rz + z : z;
	function rotate(p1,p2,_rad){
		var radius = Math.sqrt(Math.pow(p1,2) + Math.pow(p2,2));//軸からの距離
		var rad = (Math.atan(p1 / p2) + (p2 < 0 ? Math.PI : 0));
		return [
			radius * Math.sin(_rad + rad),
			radius * Math.cos(_rad + rad)
		];
	}
	var _p;
	for(var i = 0; i < this.proto.length; i++){
		//x軸回転
		_p = rotate(this.proto[i].y,this.proto[i].z,this.rx);
		this.vertex[i].x = this.proto[i].x;
		this.vertex[i].y = _p[0];
		this.vertex[i].z = _p[1];

		//y軸回転
		_p = rotate(this.vertex[i].x,this.vertex[i].z,this.ry);
		this.vertex[i].x = _p[0];
		//this.vertex[i].y = this.proto[i].y;
		this.vertex[i].z = _p[1];

		//z軸回転
		_p = rotate(this.vertex[i].x,this.vertex[i].y,this.rz);
		this.vertex[i].x = _p[0];
		this.vertex[i].y = _p[1];
		//this.vertex[i].z = this.proto[i].z;
	}
	//回転すると法線の向きも変わる
	for(var i = 0; i < this.polygons.length; i++)
		this.polygons[i].vector();
	return;
	/*
	//x軸回転
	for(i = 0; i < this.p.length; i++){
		var radius = Math.sqrt(Math.pow(this.p[i].y,2) + Math.pow(this.p[i].z,2));//x軸からの距離
		var rad = (Math.atan(this.p[i].z / this.p[i].y) + (this.p[i].y < 0 ? Math.PI : 0));
		this.p[i].y = radius * Math.sin(this.rx + rad);
		this.p[i].z = radius * Math.cos(this.rx + rad);
	}
	//y軸回転
	for(var i = 0; i < this.p.length; i++){
		var radius = Math.sqrt(Math.pow(this.p[i].x,2) + Math.pow(this.p[i].z,2));//y軸からの距離
		var rad = (Math.atan(this.p[i].x / this.p[i].z) + (this.p[i].z < 0 ? Math.PI : 0));
		this.p[i].x = radius * Math.sin(this.ry + rad);
		this.p[i].z = radius * Math.cos(this.ry + rad);
	}
	//z軸回転
	for(var i = 0; i < this.p.length; i++){
		var radius = Math.sqrt(Math.pow(this.p[i].x,2) + Math.pow(this.p[i].y,2));//z軸からの距離
		var rad = (Math.atan(this.p[i].y / this.p[i].x) + (this.p[i].x < 0 ? Math.PI : 0));
		this.p[i].x = radius * Math.sin(this.rz + rad);
		this.p[i].y = radius * Math.cos(this.rz + rad);
	}*/
}
Shape.prototype.model = function(vertexes,polys) {
	for(var i = 0; i < vertexes.length; i++){
		this.proto[i] = {
			x: vertexes[i].x * this.sx,
			y: vertexes[i].y * this.sy,
			z: vertexes[i].z * this.sz
		};
		this.vertex[i] = {
			x: vertexes[i].x * this.sx,
			y: vertexes[i].y * this.sy,
			z: vertexes[i].z * this.sz				
		};
	}
	
	for(var i = 0; i < polys.length; i++){
		var p = [];
		for(var j = 0; j < polys[i].p.length; j++){
			p.push(this.vertex[polys[i].p[j]]);
		}
		this.polygons.push(new Polygon(p, polys[i].color, polys[i].face));
	}

};
Shape.prototype.cube = function() {
	var hsx = this.sx / 2;//x方向のサイズ
	var hsy = this.sy / 2;//y方向のサイズ
	var hsz = this.sz / 2;//z方向のサイズ
	this.proto = [//原型 変更しない
		{x: - hsx, y: hsy, z: hsz},
		{x: hsx, y: hsy, z: hsz},
		{x: hsx, y: hsy, z: - hsz},
		{x: - hsx, y: hsy, z: - hsz},
		{x: - hsx, y: - hsy, z: hsz},
		{x: hsx, y: - hsy, z: hsz},
		{x: hsx, y: - hsy, z: - hsz},
		{x: - hsx, y: - hsy, z: - hsz}
	];
	var p = [
		{x: - hsx, y: hsy, z: hsz},
		{x: hsx, y: hsy, z: hsz},
		{x: hsx, y: hsy, z: - hsz},
		{x: - hsx, y: hsy, z: - hsz},
		{x: - hsx, y: - hsy, z: hsz},
		{x: hsx, y: - hsy, z: hsz},
		{x: hsx, y: - hsy, z: - hsz},
		{x: - hsx, y: - hsy, z: - hsz}
	];
	this.vertex = p;
	
/*	//top
	this.polygons.push(new Polygon([p[3],p[2],p[1]], this.color));
	this.polygons.push(new Polygon([p[0],p[1],p[5]], this.color));
	this.polygons.push(new Polygon([p[1],p[2],p[6]], this.color));
	this.polygons.push(new Polygon([p[7],p[6],p[2]], this.color));
	this.polygons.push(new Polygon([p[4],p[7],p[3]], this.color));
	//bottom
	this.polygons.push(new Polygon([p[4],p[5],p[6]], this.color));
*/
	//頂点データの順番を変えると法線の向きが変わる
	//top
	this.polygons.push(new Polygon([p[3],p[2],p[1],p[0]], this.color));
	this.polygons.push(new Polygon([p[0],p[1],p[5],p[4]], this.color));
	this.polygons.push(new Polygon([p[1],p[2],p[6],p[5]], this.color));
	this.polygons.push(new Polygon([p[7],p[6],p[2],p[3]], this.color));
	this.polygons.push(new Polygon([p[4],p[7],p[3],p[0]], this.color));
	//bottom
	this.polygons.push(new Polygon([p[4],p[5],p[6],p[7]], this.color));

};

/*
 * 複数の頂点データを持つ
 * 色データを持つ
 * 法線データを持つ
 * 面を描画する
 * シェーディング計算
 */
function Polygon(points,color,face){
	this.color = color || [127,127,127];
	this.points = points;//形状データ上の座標
	this.p = [];//3D空間上の座標
	this.dist = [];//distance 視点からの距離
	this.fp = [];//fix position 画面上の座標 2次元
	this.v = {x: 0, y: 0, z: 0};//法線の向き
	this.face = face || 1;
	this.vector();//法線の向きを定める
}
Polygon.prototype.vector = function(){
	//p4p1とp3p4の外積を求める
	var p0 = this.points[0];
	var p1 = this.points[1];
	var p2 = this.points[2];
	this.v = {
		x: (p1.y - p0.y) * (p1.z - p2.z) - (p1.z - p0.z) * (p1.y - p2.y),
		y: (p1.z - p0.z) * (p1.x - p2.x) - (p1.x - p0.x) * (p1.z - p2.z),
		z: (p1.x - p0.x) * (p1.y - p2.y) - (p1.y - p0.y) * (p1.x - p2.x)
	};
	this.v.x *= this.face;
	this.v.y *= this.face;
	this.v.z *= this.face;
	//$('#info').append($.toJSON(this.v));
	//$('#info').append('aaa');
	//document.write($.toJSON(this.v));
	//alert($.toJSON(this.v));
}
Polygon.prototype.style = function(color){
	var style = color.length > 3
	? ["rgba(", color[0], ",", color[1], ",", color[2], ",", color[3], ")"].join("")
	: ["rgb(", color[0], ",", color[1], ",", color[2], ")"].join("");
	return style;
}
Polygon.prototype.fix = function(camera){
	var cv = camera.pv(this.p);
	if(0 <= cv.x * this.v.x + cv.y * this.v.y + cv.z * this.v.z){
	//法線判定裏側のモノはパス
		this.visible = false;
		return false;			
	}
	var size = 200;
	var flg = false;
	var _p,x,y,z,rad,dist;
	for(var i = 0; i < this.p.length; i++) {
		_p = this.p[i];
		x = _p.x - camera.x;
		y = _p.y - camera.y;
		z = _p.z - camera.z;
		rad = (Math.atan(x / z) + (z < 0 ? Math.PI : 0) - camera.h) % (Math.PI * 2);
		rad_v = (Math.atan(x / z) + (z < 0 ? Math.PI : 0) - camera.v) % (Math.PI * 2);
		if(
			(rad >= Math.PI / 2 && rad <= Math.PI * 1.5)
		 || (rad <= - Math.PI / 2 && rad >= - Math.PI * 1.5)
		) {//後方のものはパス
			this.visible = false;
			return false;
		}
		if(
				(rad >= Math.PI / 2 && rad <= Math.PI * 1.5)
			 || (rad <= - Math.PI / 2 && rad >= - Math.PI * 1.5)
		) {//画面外のものはパス
			this.visible = false;
			return false;
		}
		dist = Math.sqrt(x * x + z * z);
		dist = Math.sqrt(dist * dist + y * y);
		x = dist * Math.sin(rad);
		z = dist * Math.cos(rad);
		this.dist[i] = dist;
		this.fp[i] = {x: x * camera.zoom / z * size, y: -y * camera.zoom / z * size};
		if(
			Math.abs(this.fp[i].x) < halfCanvasWidth
		 &&	Math.abs(this.fp[i].y) < halfCanvasHeight
		) flg = true;//頂点のうち１つでも画面内にあればtrue
	}
	if(flg) this.visible = true;
	else this.visible = false;
}
Polygon.prototype.draw = function(){
	ctx.beginPath();
	ctx.moveTo(
		halfCanvasWidth + this.fp[0].x,
		halfCanvasHeight + this.fp[0].y
	);
	for(var i = 1; i < this.fp.length; i++) {
		ctx.lineTo(
			halfCanvasWidth + this.fp[i].x,
			halfCanvasHeight + this.fp[i].y
		);
	}
	ctx.closePath();
	ctx.fillStyle = this.style(this.color);
	ctx.fill();
	//ctx.strokeStyle = this.style(this.color);
	//ctx.stroke();	
}
