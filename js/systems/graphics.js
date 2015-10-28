var GraphicsSystem = function(entities) {
	this.entities = entities;
	// Canvas is where we draw
	this.canvas = document.getElementById('main-canvas');
	// Canvas is what we draw to
	this.context = this.canvas.getContext('2d');
};

GraphicsSystem.prototype.run = function() {
	// Tick the graphics system a few times to see it in action
	for (var i = 0; i < 5; i++) {
		this.tick();
	}
};

GraphicsSystem.prototype.tick = function() {
	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		if (!'graphics' in entity.components) {
			continue;
		}
		entity.components.graphics.draw(this.context);
	}
};

exports.GraphicsSystem = GraphicsSystem;
