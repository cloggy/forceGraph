function Node(position, mass, velocity) {
	this.p = position;
	this.m = mass;
	this.v = velocity;
	this.stuck = false;

	//A node has no springs attached to begin with
	this.springs = [];
}