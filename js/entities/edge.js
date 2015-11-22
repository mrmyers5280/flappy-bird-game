var physicsComponent = require("../components/physics/physics");
var collisionComponent = require("../components/collision/rect");
// var settings = require("../settings");

var Edge = function() {
	var physics = new physicsComponent.PhysicsComponent(this);
	physics.position.x = -1;
	physics.position.y = 0;

	var collision = new collisionComponent.RectCollisionComponent(this, {x: 0, y: 1});
	collision.onCollision = this.onCollision.bind(this);

	this.components = {
		physics: physics,
		collision: collision
	};

	console.log('Creating edge entity', this);
};

Edge.prototype.onCollision = function(entity) {
	console.log("Edge collided with entity: ", entity);
	// Stuff we want to do to the entity itself
};

exports.Edge = Edge;
