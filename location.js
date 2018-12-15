function Location(x,y,z,h,v){
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.h = h || 0;
	this._v = v || 0;
	this.v = {x: 0, y: 0, z: 0};//velocity speed
};
/*Location.prototype.forward = function(dist){
	dist = dist || 1;
	var x = Math.sin(this.h) * dist;
	var z = Math.cos(this.h) * dist;

	this.x += x * Math.cos(this._v);
	this.y += Math.sin(this._v) * dist;
	this.z += z * Math.cos(this._v);
};*/
Location.prototype.forward = function(fps){
	this.x += this.v.x / fps;
	this.y += this.v.y / fps;
	this.z += this.v.z / fps;
};
Location.prototype.fall = function(){
	
};
Location.prototype.direction = function(h,v,diff){
	h = h / 180 * Math.PI;
	v = v / 180 * Math.PI;
	this.h = (diff ? this.h + h : h) % (Math.PI * 2);
	this._v = (diff ? this._v + v : v) % (Math.PI * 2);
	//this.vector();
	this.v.x = (diff ? this.h + h : h) % (Math.PI * 2);
	this.v.y = (diff ? this._v + v : v) % (Math.PI * 2);
	//$('#info').html('h: ' + this.h + ' v: ' + this.v);
	//$('#info').html($.toJSON(this.v));
};
Location.prototype.move = function(x,y,z,diff){
	if(diff){
		this.x += x;
		this.y += y;
		this.z += z;
	}
	else{
		this.x = x;
		this.y = y;
		this.z = z;
	}
}
Location.prototype.vector = function(){
	this.v = {
		x: 0,
		y: 0,
		z: 1
	};
}

/*
 * 座標情報を持つ(x,y,z)
 * 向いてる方向情報を持つ(dx,dy,dz)ラジアン
 * Locationを継承する
 */
function Camera(x,y,z,h,v,zoom){
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.h = h || 0;
	this._v = v || 0;
	this.v = {x: 0, y: 0, z: 0};
	this.zoom = zoom || 1;
}
Camera.prototype = new Location();
Camera.prototype.pv = function(p){//polygon vector カメラとポリゴンの位置関係をベクトルにする
	var c = {x: 0, y: 0, z: 0};//center
	for(var i = 0; i < p.length; i++){
		c.x += p[i].x;
		c.y += p[i].y;
		c.z += p[i].z;
	}
	c.x /= p.length;
	c.y /= p.length;
	c.z /= p.length;
	return {x: c.x - this.x, y: c.y - this.y, z: c.z - this.z};
}

function Light(x,y,z,h,v){
	this.v = {x: 0, y: -10, z: 0};
}
Light.prototype = new Location();
