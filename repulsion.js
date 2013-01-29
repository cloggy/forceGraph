//var coulombConstant = 8.9875517873681764 * 10e+9 // N m^2 C^-2

//repulse two nodes based on their positions and charges
//return the force that these nodes are being repulsed by
function repulse(n1, n2) {
	var r = Vector.subtract(n1.p, n2.p),
		normal = r.normalize(),
		magnitude = r.magnitude();

	return ( normal.multiply(100000).divide(magnitude*2) );
}