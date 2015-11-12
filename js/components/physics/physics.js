var PhysicsComponent = function(entity) {
	this.entity = entity;

	this.position = {
		x: 0,
		y: 0
	};
	this.velocity = {
		x: 0,
		y: 0
	};
	this.acceleration = {
		x: 0,
		y: 0
	};
};

PhysicsComponent.prototype.update = function(delta) {
	this.velocity.x += this.acceleration.x * delta;
	this.velocity.y += this.acceleration.y * delta;

	this.position.x += this.velocity.x * delta;
	this.position.y += this.velocity.y * delta;
};

PhysicsComponent.prototype.resetBird = function() {
	// Reset bird to starting point
	this.position.y = 0.5;
	this.velocity.y = 0;
	this.acceleration.y = 0;
};

exports.PhysicsComponent = PhysicsComponent;
