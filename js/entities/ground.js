var physicsComponent = require("../components/physics/physics");
var collisionComponent = require("../components/collision/rect");
// var settings = require("../settings");

var Ground = function() {
	console.log("Creating Ground Entity");
	var physics = new physicsComponent.PhysicsComponent(this);
	physics.position.x = 0;
	physics.position.y = 0;

	var collision = new collisionComponent.RectCollisionComponent(this, {x: 0, y: 0});
	collision.onCollision = this.onCollision.bind(this);

	this.components = {
		physics: physics,
		collision: collision
	};
};

Ground.prototype.onCollision = function(entity) {
	console.log("Ground collided with entity: ", entity);
	// Reset bird to middle (x=0, y=0.5)
	// var physics = new physicsComponent.PhysicsComponent(this);
	// this.components.physics.resetBird();
};

exports.Ground = Ground;
