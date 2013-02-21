function Graph(svgElement, graphData) {
	this.element = svgElement;
	this.data = graphData;

	this.initialized = false;
	this.selectedElement = null;

	//render variables
	this.framesPerSecond = 30;
	this.rendering = true;
}

Graph.prototype.renderLoop = function(startTime) {
	var timeToWait = 1000 / this.framesPerSecond;

	if(startTime === undefined) {
		startTime = new Date().getTime();
	}

	setTimeout(function(graph) {
		var end = new Date().getTime(),
			timeDiff = (end - startTime) / 1000,
			node = null,
			otherNode = null,
			totalForce = null,
			s = 0,
			sL = 0,
			spring = null,
			velocity = null,
			acceleration = null,
			totalKineticEnergy = 0.0,
			j = 0;

		for(var i=0, l=graph.data.nodes.length; i<l; ++i) {
			totalForce = new Vector(0, 0);
			node = graph.data.nodes[i];

			if(graph.selectedElement && mousePosition && i===parseInt(graph.selectedElement.getAttribute('id'))) {
				node.p = Vector.copy(mousePosition);
				node.v.set(0,0);
				continue;
			}

			// if(node.stuck) {
			// 	continue;
			// }

			//update totalForce for each spring attached to the node
			for(s = 0, sL = node.springs.length; s<sL; ++s) {
				spring = node.springs[s];
				totalForce.add(spring.calculateForce(node));
			}

			for(j = 0; j<l; ++j) {
				otherNode = graph.data.nodes[j];
				if(otherNode===node) {
					continue;
				}
				totalForce.add(repulse(node, otherNode));
			}

			//A = F/M: Acceleration will be recalculated at each timestep
			acceleration = Vector.divide(totalForce, node.m);

			//V += A*t: update our node's current velocity
			node.v.add(acceleration.multiply(timeDiff));

			//Ke = .5*m*v^2
			totalKineticEnergy += 0.5 * node.m * node.v.dotProduct(node.v);

			//P += v*t: update our node's current position
			node.p.add(Vector.multiply(node.v, timeDiff));

			//apply some level of velocity damping - gotta slow shit down eventually!
			node.v.multiply(0.40);
		}

		graph._render();

		// If the system's total kinetic energy is lower than some arbitrary value, stop wasting CPU cycles!
		if(totalKineticEnergy > 10) {
			graph.renderLoop();
		} else {
			graph.rendering = false;
		}
	}, timeToWait, this);

	//we are now in a state of rendering
	this.rendering = true;
}

Graph.prototype._create = function() {
	var edge = null,
		n1 = null,
		n2 = null,
		i = 0,
		numOfEdges = this.data.edges.length,
		l = this.data.nodes.length,
		createdElement = null,
		that = this;

	//TODO: this is referencing things that are not actually part of this object
	this.element.onmousemove = function(evt) {
		mousePosition = new Vector(evt.clientX-5, evt.clientY-5);
	}

	this.element.onmouseup = function(evt) {
		if(that.selectedElement) {
			that.selectedElement.setAttribute('fill', '#0ff');
			that.selectedElement = null;
		}
	}

	while(this.element.hasChildNodes()) {
		this.element.removeChild(this.element.lastChild);
	}

	for(i=0, l=numOfEdges; i<l; i++) {
		edge = this.data.edges[i];
		n1 = this.data.nodes[edge.source];
		n2 = this.data.nodes[edge.target];
		
		this._renderLine(n1.p.x, n1.p.y, n2.p.x, n2.p.y);
	}

	for(i=0, l=this.data.nodes.length; i<l; i++) {
		n1 = this.data.nodes[i];

		//render the nodes at their starting positions
		createdElement = this._renderCircle(n1.p.x, n1.p.y, 10);
		createdElement.setAttribute('id', i);
	}

	this.initialized = true;
}

Graph.prototype._render = function() {
	if(!this.initialized) {
		this._create();	
	}

	var edge = null,
		n1 = null,
		n2 = null,
		i = 0,
		numOfEdges = this.data.edges.length,
		l = this.data.nodes.length;

	for(i=0, l=numOfEdges; i<l; i++) {
		edge = this.data.edges[i];
		n1 = this.data.nodes[edge.source];
		n2 = this.data.nodes[edge.target];
		
		this.element.childNodes[i].setAttribute('x1', n1.p.x);
		this.element.childNodes[i].setAttribute('x2', n2.p.x);
		this.element.childNodes[i].setAttribute('y1', n1.p.y);
		this.element.childNodes[i].setAttribute('y2', n2.p.y);
	}

	for(i=0, l=this.data.nodes.length; i<l; i++) {
		n1 = this.data.nodes[i];

		this.element.childNodes[i+numOfEdges].setAttribute('cx', n1.p.x);
		this.element.childNodes[i+numOfEdges].setAttribute('cy', n1.p.y);
	}
}

Graph.prototype._renderCircle = function(x, y, r) {
	var el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	//el.setAttribute('nodeIndex', 0);
	el.setAttribute('class', 'node');
	el.setAttribute('cx', x);
	el.setAttribute('cy', y);
	el.setAttribute('r', r);
	el.setAttribute('stroke', '#333');
	el.setAttribute('stroke-width', 1);
	el.setAttribute('fill', '#0ff');

	var that = this;
	el.onmouseover = function(evt) {
		if(that.selectedElement) {
			return true;
		}

		var element = evt.target;
		element.setAttribute('fill', '#f00');
	}

	el.onmouseout = function(evt) {
		if(that.selectedElement) {
			return true;
		}

		var element = evt.target;
		element.setAttribute('fill', '#0ff');
	}

	el.onmousedown = function(evt) {
		var element = evt.target;
		that.selectedElement = element;
		element.setAttribute('fill', '#000');
		if(!that.rendering) {
			that.renderLoop();
		}
	}

	el.onmouseup = function(evt) {
		var element = evt.target;
		if(that.selectedElement) {
			that.selectedElement.setAttribute('fill', '#f00');
			that.selectedElement = null;
		}
	}

	this.element.appendChild(el);

	return el;
}

Graph.prototype._renderLine = function(x1, y1, x2, y2) {
	var el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	el.setAttribute('x1', x1);
	el.setAttribute('x2', x2);
	el.setAttribute('y1', y1);
	el.setAttribute('y2', y2);
	el.setAttribute('stroke', '#333');
	el.setAttribute('stroke-width', 1);
	this.element.appendChild(el);

	return el;
}