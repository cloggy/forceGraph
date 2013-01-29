function Node(position, mass, velocity) {
	this.p = position;
	this.m = mass;
	this.v = velocity;

	//A node has no springs attached to begin with
	this.springs = [];
}