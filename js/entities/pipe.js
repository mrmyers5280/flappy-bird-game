var graphicsComponent = require("../components/graphics/pipe");
var physicsComponent = require("../components/physics/physics");
var collisionComponent = require("../components/collision/rect");
// var settings = require("../settings");

var Pipe = function(position) {	// position comes from flappy_bird entities array
	// console.log("Creating Pipe entity");
	var physics = new physicsComponent.PhysicsComponent(this);
	physics.position.x = position.x;
	physics.position.y = position.y;
	physics.velocity.x = -0.1;	// move the pipes towards the bird

	var graphics = new graphicsComponent.PipeGraphicsComponent(this);
	var collision = new collisionComponent.RectCollisionComponent(this, {x: 0.1, y: 0.4});	// coordinates are the size of each pipe
	collision.onCollision = this.onCollision.bind(this);

	this.components = {
		physics: physics,
		graphics: graphics,
		collision: collision
	};
};

Pipe.prototype.onCollision = function(entity) {
	console.log("Pipe collided with entity: ", entity);
};

exports.Pipe = Pipe;
