/*
source point,
target point,
equilibrium length,
k value (hooke's law)
*/
function Spring(sourceNode, targetNode, eqL, k) {
	this.source = sourceNode;
	this.target = targetNode;
	this.equilibriumLength = eqL;
	this.k = k;

	sourceNode.springs.push(this);
	targetNode.springs.push(this);
}

//F = -k*x
Spring.prototype.calculateForce = function(node) {
	var direction = 0.5;
	if(node===this.target) {
		direction = -0.5;
	}

	var x = Vector.subtract(this.source.p, this.target.p),
		magnitude = x.magnitude(),
		distFromEquilibrium = magnitude - this.equilibriumLength,
		normal = x.normalize();

	//Return the spring force vector
	normal.multiply((-this.k)*distFromEquilibrium*direction);
	return normal;
}
