function Vector(_x, _y) {
	this.x = _x;
	this.y = _y;
}

Vector.prototype.add = function(v) {
	this.x += v.x;
	this.y += v.y;

	return this;
}

Vector.prototype.subtract = function(v) {
	this.x -= v.x;
	this.y -= v.y;

	return this;
}

//TODO: change these function
Vector.prototype.multiply = function(scalar) {
	this.x *= scalar;
	this.y *= scalar;

	return this;
}

Vector.prototype.divide = function(scalar) {
	this.x /= scalar;
	this.y /= scalar;

	return this;
}

Vector.prototype.magnitude = function() {
	return Math.sqrt(this.x*this.x + this.y*this.y);
}

Vector.prototype.dotProduct = function(v) {
	return this.x*v.x + this.y*v.y;
}

Vector.prototype.normalize = function() {
	var magnitude = this.magnitude(),
		normal = new Vector(this.x / magnitude, this.y / magnitude);

	return normal;
}

Vector.add = function(v1, v2) {
	return new Vector(v1.x + v2.x, v1.y + v2.y);
}

Vector.subtract = function(v1, v2) {
	return new Vector(v1.x - v2.x, v1.y - v2.y);
}

Vector.multiply = function(v, scalar) {
	return new Vector(v.x * scalar, v.y * scalar);
}

Vector.divide = function(v, scalar) {
	return new Vector(v.x / scalar, v.y / scalar);
}