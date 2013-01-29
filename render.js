function renderCircle(svg, x, y, r) {
	var el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	el.setAttribute('cx', x);
	el.setAttribute('cy', y);
	el.setAttribute('r', r);
	el.setAttribute('stroke', '#333');
	el.setAttribute('stroke-width', 1);
	el.setAttribute('fill', '#000');
	svg.appendChild(el);
}

function renderLine(svg, x1, y1, x2, y2) {
	var el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	el.setAttribute('x1', x1);
	el.setAttribute('x2', x2);
	el.setAttribute('y1', y1);
	el.setAttribute('y2', y2);
	el.setAttribute('stroke', '#333');
	el.setAttribute('stroke-width', 1);
	svg.appendChild(el);
}

function renderGraph(svg, data) {
	var edge = null,
		n1 = null,
		n2 = null,
		i = 0,
		l = data.nodes.length;

	while(svg.hasChildNodes()) {
		svg.removeChild(svg.lastChild);
	}

	for(i=0, l=data.edges.length; i<l; i++) {
		edge = data.edges[i];
		n1 = data.nodes[edge.source];
		n2 = data.nodes[edge.target];
		renderLine(svg, n1.p.x, n1.p.y, n2.p.x, n2.p.y);
	}

	for(i=0, l=data.nodes.length; i<l; i++) {
		n1 = data.nodes[i];

		//render the nodes at their starting positions
		renderCircle(svg, n1.p.x, n1.p.y, 5);
	}
}