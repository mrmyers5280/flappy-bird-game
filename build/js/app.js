(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CircleCollisionComponent = function(entity, radius) {
	this.entity = entity;
	this.radius = radius;
	this.type = 'circle';
};

CircleCollisionComponent.prototype.collidesWith = function(entity) {
	if (entity.components.collision.type == 'circle') {
		return this.collideCircle(entity);
	}
	else if (entity.components.collision.type == 'rect') {
		return this.collideRect(entity);
	}
	return false;
};

CircleCollisionComponent.prototype.collideCircle = function(entity) {
	var positionA = this.entity.components.physics.position;
	var positionB = entity.components.physics.position; // What entity is this?

	var radiusA = this.radius;
	var radiusB = entity.components.collision.radius;

	var diff = {x: positionA.x - positionB.x,
				y: positionA.y - positionB.y};

	var distanceSquared = diff.x * diff.x + diff.y * diff.y;
	var radiusSum = radiusA + radiusB;

	return distanceSquared < radiusSum * radiusSum;
};

CircleCollisionComponent.prototype.collideRect = function(entity) {
	var clamp = function(value, low, high) {
		if (value < low) {
			return low;
		}
		if (value > high) {
			return high;
		}
		return value;
	};

	var positionA = this.entity.components.physics.position;
	var positionB = entity.components.physics.position;
	var sizeB = entity.components.collision.size;

	var closest = {
		x: clamp(positionA.x, positionB.x,
				positionB.x + sizeB.x),
		y: clamp(positionA.y, positionB.y,
				positionB.y + sizeB.y)
	};

	var radiusA = this.radius;

	var diff = {x: positionA.x - closest.x,
				y: positionA.y - closest.y};

	var distanceSquared = diff.x * diff.x + diff.y * diff.y;
	return distanceSquared < radiusA * radiusA;    // has there been a collision
};

exports.CircleCollisionComponent = CircleCollisionComponent;

},{}],2:[function(require,module,exports){
var RectCollisionComponent = function(entity, size) {
	this.entity = entity;
	this.size = size;
	this.type = 'rect';
};

RectCollisionComponent.prototype.collidesWith = function(entity) {
	if (entity.components.collision.type == 'circle') {
		return this.collideCircle(entity);
	}
	else if (entity.components.collision.type == 'rect') {
		return this.collideRect(entity);
	}
	return false;
};

RectCollisionComponent.prototype.collideCircle = function(entity) {
	return entity.components.collision.collideRect(this.entity);
};

RectCollisionComponent.prototype.collideRect = function(entity) {
	var positionA = this.entity.components.physics.position;
	var positionB = entity.components.physics.position;

	var sizeA = this.size;
	var sizeB = entity.components.collision.size;

	var leftA = positionA.x - sizeA.x / 2;
	var rightA = positionA.x + sizeA.x / 2;
	var bottomA = positionA.y - sizeA.y / 2;
	var topA = positionA.y + sizeA.y / 2;

	var leftB = positionB.x - sizeB.x / 2;
	var rightB = positionB.x + sizeB.x / 2;
	var bottomB = positionB.y - sizeB.y / 2;
	var topB = positionB.y + sizeB.y / 2;

	return !(leftA > rightB || leftB > rightA ||
			bottomA > topB || bottomB > topA);
};

exports.RectCollisionComponent = RectCollisionComponent;

},{}],3:[function(require,module,exports){
var BirdGraphicsComponent = function(entity) {
	this.entity = entity;
};

BirdGraphicsComponent.prototype.draw = function(context) {
	var position = this.entity.components.physics.position;

	context.save();
	context.translate(position.x, position.y);
	context.beginPath();
	context.arc(0, 0, 0.02, 0, 2 * Math.PI);
	context.fill();
	context.closePath();
	context.restore();
};

exports.BirdGraphicsComponent = BirdGraphicsComponent;

},{}],4:[function(require,module,exports){
var PipeGraphicsComponent = function(entity) {
	this.entity = entity;
};

PipeGraphicsComponent.prototype.draw = function(context) {
	var position = this.entity.components.physics.position;
	// var position = { x: 1, y: 0 };

	context.save();
	context.translate(position.x, position.y);
	context.beginPath();
	context.fillStyle = "green";
	context.fillRect(0, 0, 0.1, 0.4);
	context.closePath();
	context.restore();
};

exports.PipeGraphicsComponent = PipeGraphicsComponent;

},{}],5:[function(require,module,exports){
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
};

exports.PhysicsComponent = PhysicsComponent;

},{}],6:[function(require,module,exports){
var graphicsComponent = require("../components/graphics/bird");
var physicsComponent = require("../components/physics/physics");
var collisionComponent = require("../components/collision/circle");
// var settings = require("../settings");

var Bird = function() {
	// console.log("Creating Bird Entity");
	var physics = new physicsComponent.PhysicsComponent(this);
	physics.position.y = 0.5;
	// physics.acceleration.y = -2;	// How strong gravity is

	var graphics = new graphicsComponent.BirdGraphicsComponent(this);
	var collision = new collisionComponent.CircleCollisionComponent(this, 0.02);
	collision.onCollision = this.onCollision.bind(this);

	this.components = {
		physics: physics,
		graphics: graphics,
		collision: collision
	};
};

Bird.prototype.onCollision = function(entity) {
	console.log("Bird collided with entity: ", entity);
	// Reset bird to middle (x=0, y=0.5)
	this.components.physics.resetBird();
};

exports.Bird = Bird;

},{"../components/collision/circle":1,"../components/graphics/bird":3,"../components/physics/physics":5}],7:[function(require,module,exports){
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

},{"../components/collision/rect":2,"../components/physics/physics":5}],8:[function(require,module,exports){
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

},{"../components/collision/rect":2,"../components/physics/physics":5}],9:[function(require,module,exports){
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

},{"../components/collision/rect":2,"../components/graphics/pipe":4,"../components/physics/physics":5}],10:[function(require,module,exports){
var graphicsSystem = require('./systems/graphics');
var physicsSystem = require('./systems/physics');
var inputSystem = require('./systems/input');
var pipesSystem = require('./systems/pipes');
var bird = require('./entities/bird');
var pipe = require('./entities/pipe');
var ground = require('./entities/ground');
var edge = require('./entities/edge');

var FlappyBird = function() {
	this.entities = [new bird.Bird(), new pipe.Pipe({ x: 1, y: 0 }), new pipe.Pipe({ x: 1, y: 0.6 }), new ground.Ground(), new edge.Edge()];
	this.graphics = new graphicsSystem.GraphicsSystem(this.entities);
	this.physics = new physicsSystem.PhysicsSystem(this.entities);
	this.input = new inputSystem.InputSystem(this.entities);
	this.pipes = new pipesSystem.PipesSystem(this.entities);
};

FlappyBird.prototype.run = function() {
	this.graphics.run();
	this.physics.run();
	this.input.run();
	this.pipes.run();
};

exports.FlappyBird = FlappyBird;

},{"./entities/bird":6,"./entities/edge":7,"./entities/ground":8,"./entities/pipe":9,"./systems/graphics":13,"./systems/input":14,"./systems/physics":15,"./systems/pipes":16}],11:[function(require,module,exports){
var flappyBird = require('./flappy_bird');

document.addEventListener('DOMContentLoaded', function() {
	var app = new flappyBird.FlappyBird();
	app.run();
});

},{"./flappy_bird":10}],12:[function(require,module,exports){
var pipe = require('../entities/pipe');
var bird = require('../entities/bird');
var edge = require('../entities/edge');

var CollisionSystem = function(entities) {
	this.entities = entities;
};

CollisionSystem.prototype.tick = function() {
	for (var i = 0; i < this.entities.length; i++) {
		var entityA = this.entities[i];
		if (!('collision' in entityA.components)) {
			continue;
		}

		for (var j = i+1; j < this.entities.length; j++) {
			var entityB = this.entities[j];
			if (!('collision' in entityB.components)) {
				continue;
			}

			if (!(entityA.components.collision.collidesWith(entityB))) {
				continue;
			}

			if (entityA.components.collision.onCollision) {
				entityA.components.collision.onCollision(entityB);
			}

			if (entityB.components.collision.onCollision) {
				entityB.components.collision.onCollision(entityA);
			}

			if (entityA instanceof bird.Bird || entityB instanceof bird.Bird) {
				this.removePipes();
			}

			if (entityA instanceof edge.Edge) {
				this.removeEntity(entityB);
			}

			if (entityB instanceof edge.Edge) {
				this.removeEntity(entityA);
			}
		}
	}
};

CollisionSystem.prototype.removePipes = function(context) {
	// Loop over the existing pipes & remove them
	var entitiesCopy = this.entities.slice();   // copy the array
	for (var i = 0; i < entitiesCopy.length; i++) {
		if (entitiesCopy[i] instanceof pipe.Pipe) {
			// Remove the pipe from the array
			this.removeEntity(entitiesCopy[i]);
		}
	}
};

CollisionSystem.prototype.removeEntity = function(entity) {
	// Remove the first two pipes from the array
	console.log('In removeEntity');
	this.entities.splice(this.entities.indexOf(entity), 1);
};

exports.CollisionSystem = CollisionSystem;

},{"../entities/bird":6,"../entities/edge":7,"../entities/pipe":9}],13:[function(require,module,exports){
var GraphicsSystem = function(entities) {
	this.entities = entities;	// [Bird, Pipe, Pipe]
	// Canvas is where we draw
	this.canvas = document.getElementById('main-canvas');
	// Canvas is what we draw to
	this.context = this.canvas.getContext('2d');
};

GraphicsSystem.prototype.run = function() {
	// Run the render loop
	window.requestAnimationFrame(this.tick.bind(this));
};

GraphicsSystem.prototype.tick = function() {
	// Set the canvas to the correct size if the window is resized
	if (this.canvas.width != this.canvas.offsetWidth ||
		this.canvas.height != this.canvas.offsetHeight) {
			this.canvas.width = this.canvas.offsetWidth;
			this.canvas.height = this.canvas.offsetHeight;
		}

	// Clear the canvas
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	this.context.save();
	this.context.translate(this.canvas.width / 2, this.canvas.height);
	this.context.scale(this.canvas.height, -this.canvas.height);	//flips the y coord

	// Rendering goes here
	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		if (!('graphics' in entity.components)) {
			continue;
		}
		entity.components.graphics.draw(this.context);
	}

	this.context.restore();

	// Continue the render loop
	window.requestAnimationFrame(this.tick.bind(this));
};

exports.GraphicsSystem = GraphicsSystem;

},{}],14:[function(require,module,exports){
var InputSystem = function(entities) {
	this.entities = entities;

	// Canvas is where we get input from
	this.canvas = document.getElementById('main-canvas');
};

InputSystem.prototype.run = function() {
	this.canvas.addEventListener('click', this.onClick.bind(this));
};

InputSystem.prototype.onClick = function() {
	var bird = this.entities[0];
	bird.components.physics.velocity.y = 0.6;
};

exports.InputSystem = InputSystem;

},{}],15:[function(require,module,exports){
var collisionSystem = require("./collision");

var PhysicsSystem = function(entities) {
	this.entities = entities;
	this.collisionSystem = new collisionSystem.CollisionSystem(entities);
};

PhysicsSystem.prototype.run = function() {
	// Run the update loop
	window.setInterval(this.tick.bind(this), 1000 / 60);
};

PhysicsSystem.prototype.tick = function() {
	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		if (!('physics' in entity.components)) {
			continue;
		}
		entity.components.physics.update(1/60);
	}
	this.collisionSystem.tick();
};

exports.PhysicsSystem = PhysicsSystem;

},{"./collision":12}],16:[function(require,module,exports){
var pipe = require('../entities/pipe');

var PipesSystem = function(entities) {
	this.entities = entities;
};

PipesSystem.prototype.run = function() {
	// Run the update loop
	window.setInterval(this.tick.bind(this), 4000);
};

PipesSystem.prototype.tick = function() {
	console.log('In PipesSystem');
	var pipeBottom = new pipe.Pipe({ x: 1, y: 0 });
	var pipeTop = new pipe.Pipe({ x: 1, y: 0.6 });
	this.entities.push(pipeBottom, pipeTop);
};

exports.PipesSystem = PipesSystem;

},{"../entities/pipe":9}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jb21wb25lbnRzL2NvbGxpc2lvbi9jaXJjbGUuanMiLCJqcy9jb21wb25lbnRzL2NvbGxpc2lvbi9yZWN0LmpzIiwianMvY29tcG9uZW50cy9ncmFwaGljcy9iaXJkLmpzIiwianMvY29tcG9uZW50cy9ncmFwaGljcy9waXBlLmpzIiwianMvY29tcG9uZW50cy9waHlzaWNzL3BoeXNpY3MuanMiLCJqcy9lbnRpdGllcy9iaXJkLmpzIiwianMvZW50aXRpZXMvZWRnZS5qcyIsImpzL2VudGl0aWVzL2dyb3VuZC5qcyIsImpzL2VudGl0aWVzL3BpcGUuanMiLCJqcy9mbGFwcHlfYmlyZC5qcyIsImpzL21haW4uanMiLCJqcy9zeXN0ZW1zL2NvbGxpc2lvbi5qcyIsImpzL3N5c3RlbXMvZ3JhcGhpY3MuanMiLCJqcy9zeXN0ZW1zL2lucHV0LmpzIiwianMvc3lzdGVtcy9waHlzaWNzLmpzIiwianMvc3lzdGVtcy9waXBlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQ2lyY2xlQ29sbGlzaW9uQ29tcG9uZW50ID0gZnVuY3Rpb24oZW50aXR5LCByYWRpdXMpIHtcblx0dGhpcy5lbnRpdHkgPSBlbnRpdHk7XG5cdHRoaXMucmFkaXVzID0gcmFkaXVzO1xuXHR0aGlzLnR5cGUgPSAnY2lyY2xlJztcbn07XG5cbkNpcmNsZUNvbGxpc2lvbkNvbXBvbmVudC5wcm90b3R5cGUuY29sbGlkZXNXaXRoID0gZnVuY3Rpb24oZW50aXR5KSB7XG5cdGlmIChlbnRpdHkuY29tcG9uZW50cy5jb2xsaXNpb24udHlwZSA9PSAnY2lyY2xlJykge1xuXHRcdHJldHVybiB0aGlzLmNvbGxpZGVDaXJjbGUoZW50aXR5KTtcblx0fVxuXHRlbHNlIGlmIChlbnRpdHkuY29tcG9uZW50cy5jb2xsaXNpb24udHlwZSA9PSAncmVjdCcpIHtcblx0XHRyZXR1cm4gdGhpcy5jb2xsaWRlUmVjdChlbnRpdHkpO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn07XG5cbkNpcmNsZUNvbGxpc2lvbkNvbXBvbmVudC5wcm90b3R5cGUuY29sbGlkZUNpcmNsZSA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHR2YXIgcG9zaXRpb25BID0gdGhpcy5lbnRpdHkuY29tcG9uZW50cy5waHlzaWNzLnBvc2l0aW9uO1xuXHR2YXIgcG9zaXRpb25CID0gZW50aXR5LmNvbXBvbmVudHMucGh5c2ljcy5wb3NpdGlvbjsgLy8gV2hhdCBlbnRpdHkgaXMgdGhpcz9cblxuXHR2YXIgcmFkaXVzQSA9IHRoaXMucmFkaXVzO1xuXHR2YXIgcmFkaXVzQiA9IGVudGl0eS5jb21wb25lbnRzLmNvbGxpc2lvbi5yYWRpdXM7XG5cblx0dmFyIGRpZmYgPSB7eDogcG9zaXRpb25BLnggLSBwb3NpdGlvbkIueCxcblx0XHRcdFx0eTogcG9zaXRpb25BLnkgLSBwb3NpdGlvbkIueX07XG5cblx0dmFyIGRpc3RhbmNlU3F1YXJlZCA9IGRpZmYueCAqIGRpZmYueCArIGRpZmYueSAqIGRpZmYueTtcblx0dmFyIHJhZGl1c1N1bSA9IHJhZGl1c0EgKyByYWRpdXNCO1xuXG5cdHJldHVybiBkaXN0YW5jZVNxdWFyZWQgPCByYWRpdXNTdW0gKiByYWRpdXNTdW07XG59O1xuXG5DaXJjbGVDb2xsaXNpb25Db21wb25lbnQucHJvdG90eXBlLmNvbGxpZGVSZWN0ID0gZnVuY3Rpb24oZW50aXR5KSB7XG5cdHZhciBjbGFtcCA9IGZ1bmN0aW9uKHZhbHVlLCBsb3csIGhpZ2gpIHtcblx0XHRpZiAodmFsdWUgPCBsb3cpIHtcblx0XHRcdHJldHVybiBsb3c7XG5cdFx0fVxuXHRcdGlmICh2YWx1ZSA+IGhpZ2gpIHtcblx0XHRcdHJldHVybiBoaWdoO1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH07XG5cblx0dmFyIHBvc2l0aW9uQSA9IHRoaXMuZW50aXR5LmNvbXBvbmVudHMucGh5c2ljcy5wb3NpdGlvbjtcblx0dmFyIHBvc2l0aW9uQiA9IGVudGl0eS5jb21wb25lbnRzLnBoeXNpY3MucG9zaXRpb247XG5cdHZhciBzaXplQiA9IGVudGl0eS5jb21wb25lbnRzLmNvbGxpc2lvbi5zaXplO1xuXG5cdHZhciBjbG9zZXN0ID0ge1xuXHRcdHg6IGNsYW1wKHBvc2l0aW9uQS54LCBwb3NpdGlvbkIueCxcblx0XHRcdFx0cG9zaXRpb25CLnggKyBzaXplQi54KSxcblx0XHR5OiBjbGFtcChwb3NpdGlvbkEueSwgcG9zaXRpb25CLnksXG5cdFx0XHRcdHBvc2l0aW9uQi55ICsgc2l6ZUIueSlcblx0fTtcblxuXHR2YXIgcmFkaXVzQSA9IHRoaXMucmFkaXVzO1xuXG5cdHZhciBkaWZmID0ge3g6IHBvc2l0aW9uQS54IC0gY2xvc2VzdC54LFxuXHRcdFx0XHR5OiBwb3NpdGlvbkEueSAtIGNsb3Nlc3QueX07XG5cblx0dmFyIGRpc3RhbmNlU3F1YXJlZCA9IGRpZmYueCAqIGRpZmYueCArIGRpZmYueSAqIGRpZmYueTtcblx0cmV0dXJuIGRpc3RhbmNlU3F1YXJlZCA8IHJhZGl1c0EgKiByYWRpdXNBOyAgICAvLyBoYXMgdGhlcmUgYmVlbiBhIGNvbGxpc2lvblxufTtcblxuZXhwb3J0cy5DaXJjbGVDb2xsaXNpb25Db21wb25lbnQgPSBDaXJjbGVDb2xsaXNpb25Db21wb25lbnQ7XG4iLCJ2YXIgUmVjdENvbGxpc2lvbkNvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSwgc2l6ZSkge1xuXHR0aGlzLmVudGl0eSA9IGVudGl0eTtcblx0dGhpcy5zaXplID0gc2l6ZTtcblx0dGhpcy50eXBlID0gJ3JlY3QnO1xufTtcblxuUmVjdENvbGxpc2lvbkNvbXBvbmVudC5wcm90b3R5cGUuY29sbGlkZXNXaXRoID0gZnVuY3Rpb24oZW50aXR5KSB7XG5cdGlmIChlbnRpdHkuY29tcG9uZW50cy5jb2xsaXNpb24udHlwZSA9PSAnY2lyY2xlJykge1xuXHRcdHJldHVybiB0aGlzLmNvbGxpZGVDaXJjbGUoZW50aXR5KTtcblx0fVxuXHRlbHNlIGlmIChlbnRpdHkuY29tcG9uZW50cy5jb2xsaXNpb24udHlwZSA9PSAncmVjdCcpIHtcblx0XHRyZXR1cm4gdGhpcy5jb2xsaWRlUmVjdChlbnRpdHkpO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn07XG5cblJlY3RDb2xsaXNpb25Db21wb25lbnQucHJvdG90eXBlLmNvbGxpZGVDaXJjbGUgPSBmdW5jdGlvbihlbnRpdHkpIHtcblx0cmV0dXJuIGVudGl0eS5jb21wb25lbnRzLmNvbGxpc2lvbi5jb2xsaWRlUmVjdCh0aGlzLmVudGl0eSk7XG59O1xuXG5SZWN0Q29sbGlzaW9uQ29tcG9uZW50LnByb3RvdHlwZS5jb2xsaWRlUmVjdCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHR2YXIgcG9zaXRpb25BID0gdGhpcy5lbnRpdHkuY29tcG9uZW50cy5waHlzaWNzLnBvc2l0aW9uO1xuXHR2YXIgcG9zaXRpb25CID0gZW50aXR5LmNvbXBvbmVudHMucGh5c2ljcy5wb3NpdGlvbjtcblxuXHR2YXIgc2l6ZUEgPSB0aGlzLnNpemU7XG5cdHZhciBzaXplQiA9IGVudGl0eS5jb21wb25lbnRzLmNvbGxpc2lvbi5zaXplO1xuXG5cdHZhciBsZWZ0QSA9IHBvc2l0aW9uQS54IC0gc2l6ZUEueCAvIDI7XG5cdHZhciByaWdodEEgPSBwb3NpdGlvbkEueCArIHNpemVBLnggLyAyO1xuXHR2YXIgYm90dG9tQSA9IHBvc2l0aW9uQS55IC0gc2l6ZUEueSAvIDI7XG5cdHZhciB0b3BBID0gcG9zaXRpb25BLnkgKyBzaXplQS55IC8gMjtcblxuXHR2YXIgbGVmdEIgPSBwb3NpdGlvbkIueCAtIHNpemVCLnggLyAyO1xuXHR2YXIgcmlnaHRCID0gcG9zaXRpb25CLnggKyBzaXplQi54IC8gMjtcblx0dmFyIGJvdHRvbUIgPSBwb3NpdGlvbkIueSAtIHNpemVCLnkgLyAyO1xuXHR2YXIgdG9wQiA9IHBvc2l0aW9uQi55ICsgc2l6ZUIueSAvIDI7XG5cblx0cmV0dXJuICEobGVmdEEgPiByaWdodEIgfHwgbGVmdEIgPiByaWdodEEgfHxcblx0XHRcdGJvdHRvbUEgPiB0b3BCIHx8IGJvdHRvbUIgPiB0b3BBKTtcbn07XG5cbmV4cG9ydHMuUmVjdENvbGxpc2lvbkNvbXBvbmVudCA9IFJlY3RDb2xsaXNpb25Db21wb25lbnQ7XG4iLCJ2YXIgQmlyZEdyYXBoaWNzQ29tcG9uZW50ID0gZnVuY3Rpb24oZW50aXR5KSB7XG5cdHRoaXMuZW50aXR5ID0gZW50aXR5O1xufTtcblxuQmlyZEdyYXBoaWNzQ29tcG9uZW50LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY29udGV4dCkge1xuXHR2YXIgcG9zaXRpb24gPSB0aGlzLmVudGl0eS5jb21wb25lbnRzLnBoeXNpY3MucG9zaXRpb247XG5cblx0Y29udGV4dC5zYXZlKCk7XG5cdGNvbnRleHQudHJhbnNsYXRlKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRjb250ZXh0LmFyYygwLCAwLCAwLjAyLCAwLCAyICogTWF0aC5QSSk7XG5cdGNvbnRleHQuZmlsbCgpO1xuXHRjb250ZXh0LmNsb3NlUGF0aCgpO1xuXHRjb250ZXh0LnJlc3RvcmUoKTtcbn07XG5cbmV4cG9ydHMuQmlyZEdyYXBoaWNzQ29tcG9uZW50ID0gQmlyZEdyYXBoaWNzQ29tcG9uZW50O1xuIiwidmFyIFBpcGVHcmFwaGljc0NvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHR0aGlzLmVudGl0eSA9IGVudGl0eTtcbn07XG5cblBpcGVHcmFwaGljc0NvbXBvbmVudC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcblx0dmFyIHBvc2l0aW9uID0gdGhpcy5lbnRpdHkuY29tcG9uZW50cy5waHlzaWNzLnBvc2l0aW9uO1xuXHQvLyB2YXIgcG9zaXRpb24gPSB7IHg6IDEsIHk6IDAgfTtcblxuXHRjb250ZXh0LnNhdmUoKTtcblx0Y29udGV4dC50cmFuc2xhdGUocG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG5cdGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdGNvbnRleHQuZmlsbFN0eWxlID0gXCJncmVlblwiO1xuXHRjb250ZXh0LmZpbGxSZWN0KDAsIDAsIDAuMSwgMC40KTtcblx0Y29udGV4dC5jbG9zZVBhdGgoKTtcblx0Y29udGV4dC5yZXN0b3JlKCk7XG59O1xuXG5leHBvcnRzLlBpcGVHcmFwaGljc0NvbXBvbmVudCA9IFBpcGVHcmFwaGljc0NvbXBvbmVudDtcbiIsInZhciBQaHlzaWNzQ29tcG9uZW50ID0gZnVuY3Rpb24oZW50aXR5KSB7XG5cdHRoaXMuZW50aXR5ID0gZW50aXR5O1xuXG5cdHRoaXMucG9zaXRpb24gPSB7XG5cdFx0eDogMCxcblx0XHR5OiAwXG5cdH07XG5cdHRoaXMudmVsb2NpdHkgPSB7XG5cdFx0eDogMCxcblx0XHR5OiAwXG5cdH07XG5cdHRoaXMuYWNjZWxlcmF0aW9uID0ge1xuXHRcdHg6IDAsXG5cdFx0eTogMFxuXHR9O1xufTtcblxuUGh5c2ljc0NvbXBvbmVudC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGVsdGEpIHtcblx0dGhpcy52ZWxvY2l0eS54ICs9IHRoaXMuYWNjZWxlcmF0aW9uLnggKiBkZWx0YTtcblx0dGhpcy52ZWxvY2l0eS55ICs9IHRoaXMuYWNjZWxlcmF0aW9uLnkgKiBkZWx0YTtcblxuXHR0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54ICogZGVsdGE7XG5cdHRoaXMucG9zaXRpb24ueSArPSB0aGlzLnZlbG9jaXR5LnkgKiBkZWx0YTtcbn07XG5cblBoeXNpY3NDb21wb25lbnQucHJvdG90eXBlLnJlc2V0QmlyZCA9IGZ1bmN0aW9uKCkge1xuXHQvLyBSZXNldCBiaXJkIHRvIHN0YXJ0aW5nIHBvaW50XG5cdHRoaXMucG9zaXRpb24ueSA9IDAuNTtcblx0dGhpcy52ZWxvY2l0eS55ID0gMDtcbn07XG5cbmV4cG9ydHMuUGh5c2ljc0NvbXBvbmVudCA9IFBoeXNpY3NDb21wb25lbnQ7XG4iLCJ2YXIgZ3JhcGhpY3NDb21wb25lbnQgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9ncmFwaGljcy9iaXJkXCIpO1xudmFyIHBoeXNpY3NDb21wb25lbnQgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9waHlzaWNzL3BoeXNpY3NcIik7XG52YXIgY29sbGlzaW9uQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvY29sbGlzaW9uL2NpcmNsZVwiKTtcbi8vIHZhciBzZXR0aW5ncyA9IHJlcXVpcmUoXCIuLi9zZXR0aW5nc1wiKTtcblxudmFyIEJpcmQgPSBmdW5jdGlvbigpIHtcblx0Ly8gY29uc29sZS5sb2coXCJDcmVhdGluZyBCaXJkIEVudGl0eVwiKTtcblx0dmFyIHBoeXNpY3MgPSBuZXcgcGh5c2ljc0NvbXBvbmVudC5QaHlzaWNzQ29tcG9uZW50KHRoaXMpO1xuXHRwaHlzaWNzLnBvc2l0aW9uLnkgPSAwLjU7XG5cdC8vIHBoeXNpY3MuYWNjZWxlcmF0aW9uLnkgPSAtMjtcdC8vIEhvdyBzdHJvbmcgZ3Jhdml0eSBpc1xuXG5cdHZhciBncmFwaGljcyA9IG5ldyBncmFwaGljc0NvbXBvbmVudC5CaXJkR3JhcGhpY3NDb21wb25lbnQodGhpcyk7XG5cdHZhciBjb2xsaXNpb24gPSBuZXcgY29sbGlzaW9uQ29tcG9uZW50LkNpcmNsZUNvbGxpc2lvbkNvbXBvbmVudCh0aGlzLCAwLjAyKTtcblx0Y29sbGlzaW9uLm9uQ29sbGlzaW9uID0gdGhpcy5vbkNvbGxpc2lvbi5iaW5kKHRoaXMpO1xuXG5cdHRoaXMuY29tcG9uZW50cyA9IHtcblx0XHRwaHlzaWNzOiBwaHlzaWNzLFxuXHRcdGdyYXBoaWNzOiBncmFwaGljcyxcblx0XHRjb2xsaXNpb246IGNvbGxpc2lvblxuXHR9O1xufTtcblxuQmlyZC5wcm90b3R5cGUub25Db2xsaXNpb24gPSBmdW5jdGlvbihlbnRpdHkpIHtcblx0Y29uc29sZS5sb2coXCJCaXJkIGNvbGxpZGVkIHdpdGggZW50aXR5OiBcIiwgZW50aXR5KTtcblx0Ly8gUmVzZXQgYmlyZCB0byBtaWRkbGUgKHg9MCwgeT0wLjUpXG5cdHRoaXMuY29tcG9uZW50cy5waHlzaWNzLnJlc2V0QmlyZCgpO1xufTtcblxuZXhwb3J0cy5CaXJkID0gQmlyZDtcbiIsInZhciBwaHlzaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvcGh5c2ljcy9waHlzaWNzXCIpO1xudmFyIGNvbGxpc2lvbkNvbXBvbmVudCA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2NvbGxpc2lvbi9yZWN0XCIpO1xuLy8gdmFyIHNldHRpbmdzID0gcmVxdWlyZShcIi4uL3NldHRpbmdzXCIpO1xuXG52YXIgRWRnZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcGh5c2ljcyA9IG5ldyBwaHlzaWNzQ29tcG9uZW50LlBoeXNpY3NDb21wb25lbnQodGhpcyk7XG5cdHBoeXNpY3MucG9zaXRpb24ueCA9IC0xO1xuXHRwaHlzaWNzLnBvc2l0aW9uLnkgPSAwO1xuXG5cdHZhciBjb2xsaXNpb24gPSBuZXcgY29sbGlzaW9uQ29tcG9uZW50LlJlY3RDb2xsaXNpb25Db21wb25lbnQodGhpcywge3g6IDAsIHk6IDF9KTtcblx0Y29sbGlzaW9uLm9uQ29sbGlzaW9uID0gdGhpcy5vbkNvbGxpc2lvbi5iaW5kKHRoaXMpO1xuXG5cdHRoaXMuY29tcG9uZW50cyA9IHtcblx0XHRwaHlzaWNzOiBwaHlzaWNzLFxuXHRcdGNvbGxpc2lvbjogY29sbGlzaW9uXG5cdH07XG5cblx0Y29uc29sZS5sb2coJ0NyZWF0aW5nIGVkZ2UgZW50aXR5JywgdGhpcyk7XG59O1xuXG5FZGdlLnByb3RvdHlwZS5vbkNvbGxpc2lvbiA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHRjb25zb2xlLmxvZyhcIkVkZ2UgY29sbGlkZWQgd2l0aCBlbnRpdHk6IFwiLCBlbnRpdHkpO1xuXHQvLyBTdHVmZiB3ZSB3YW50IHRvIGRvIHRvIHRoZSBlbnRpdHkgaXRzZWxmXG59O1xuXG5leHBvcnRzLkVkZ2UgPSBFZGdlO1xuIiwidmFyIHBoeXNpY3NDb21wb25lbnQgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9waHlzaWNzL3BoeXNpY3NcIik7XG52YXIgY29sbGlzaW9uQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvY29sbGlzaW9uL3JlY3RcIik7XG4vLyB2YXIgc2V0dGluZ3MgPSByZXF1aXJlKFwiLi4vc2V0dGluZ3NcIik7XG5cbnZhciBHcm91bmQgPSBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coXCJDcmVhdGluZyBHcm91bmQgRW50aXR5XCIpO1xuXHR2YXIgcGh5c2ljcyA9IG5ldyBwaHlzaWNzQ29tcG9uZW50LlBoeXNpY3NDb21wb25lbnQodGhpcyk7XG5cdHBoeXNpY3MucG9zaXRpb24ueCA9IDA7XG5cdHBoeXNpY3MucG9zaXRpb24ueSA9IDA7XG5cblx0dmFyIGNvbGxpc2lvbiA9IG5ldyBjb2xsaXNpb25Db21wb25lbnQuUmVjdENvbGxpc2lvbkNvbXBvbmVudCh0aGlzLCB7eDogMCwgeTogMH0pO1xuXHRjb2xsaXNpb24ub25Db2xsaXNpb24gPSB0aGlzLm9uQ29sbGlzaW9uLmJpbmQodGhpcyk7XG5cblx0dGhpcy5jb21wb25lbnRzID0ge1xuXHRcdHBoeXNpY3M6IHBoeXNpY3MsXG5cdFx0Y29sbGlzaW9uOiBjb2xsaXNpb25cblx0fTtcbn07XG5cbkdyb3VuZC5wcm90b3R5cGUub25Db2xsaXNpb24gPSBmdW5jdGlvbihlbnRpdHkpIHtcblx0Y29uc29sZS5sb2coXCJHcm91bmQgY29sbGlkZWQgd2l0aCBlbnRpdHk6IFwiLCBlbnRpdHkpO1xuXHQvLyBSZXNldCBiaXJkIHRvIG1pZGRsZSAoeD0wLCB5PTAuNSlcblx0Ly8gdmFyIHBoeXNpY3MgPSBuZXcgcGh5c2ljc0NvbXBvbmVudC5QaHlzaWNzQ29tcG9uZW50KHRoaXMpO1xuXHQvLyB0aGlzLmNvbXBvbmVudHMucGh5c2ljcy5yZXNldEJpcmQoKTtcbn07XG5cbmV4cG9ydHMuR3JvdW5kID0gR3JvdW5kO1xuIiwidmFyIGdyYXBoaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvZ3JhcGhpY3MvcGlwZVwiKTtcbnZhciBwaHlzaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvcGh5c2ljcy9waHlzaWNzXCIpO1xudmFyIGNvbGxpc2lvbkNvbXBvbmVudCA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2NvbGxpc2lvbi9yZWN0XCIpO1xuLy8gdmFyIHNldHRpbmdzID0gcmVxdWlyZShcIi4uL3NldHRpbmdzXCIpO1xuXG52YXIgUGlwZSA9IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XHQvLyBwb3NpdGlvbiBjb21lcyBmcm9tIGZsYXBweV9iaXJkIGVudGl0aWVzIGFycmF5XG5cdC8vIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgUGlwZSBlbnRpdHlcIik7XG5cdHZhciBwaHlzaWNzID0gbmV3IHBoeXNpY3NDb21wb25lbnQuUGh5c2ljc0NvbXBvbmVudCh0aGlzKTtcblx0cGh5c2ljcy5wb3NpdGlvbi54ID0gcG9zaXRpb24ueDtcblx0cGh5c2ljcy5wb3NpdGlvbi55ID0gcG9zaXRpb24ueTtcblx0cGh5c2ljcy52ZWxvY2l0eS54ID0gLTAuMTtcdC8vIG1vdmUgdGhlIHBpcGVzIHRvd2FyZHMgdGhlIGJpcmRcblxuXHR2YXIgZ3JhcGhpY3MgPSBuZXcgZ3JhcGhpY3NDb21wb25lbnQuUGlwZUdyYXBoaWNzQ29tcG9uZW50KHRoaXMpO1xuXHR2YXIgY29sbGlzaW9uID0gbmV3IGNvbGxpc2lvbkNvbXBvbmVudC5SZWN0Q29sbGlzaW9uQ29tcG9uZW50KHRoaXMsIHt4OiAwLjEsIHk6IDAuNH0pO1x0Ly8gY29vcmRpbmF0ZXMgYXJlIHRoZSBzaXplIG9mIGVhY2ggcGlwZVxuXHRjb2xsaXNpb24ub25Db2xsaXNpb24gPSB0aGlzLm9uQ29sbGlzaW9uLmJpbmQodGhpcyk7XG5cblx0dGhpcy5jb21wb25lbnRzID0ge1xuXHRcdHBoeXNpY3M6IHBoeXNpY3MsXG5cdFx0Z3JhcGhpY3M6IGdyYXBoaWNzLFxuXHRcdGNvbGxpc2lvbjogY29sbGlzaW9uXG5cdH07XG59O1xuXG5QaXBlLnByb3RvdHlwZS5vbkNvbGxpc2lvbiA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHRjb25zb2xlLmxvZyhcIlBpcGUgY29sbGlkZWQgd2l0aCBlbnRpdHk6IFwiLCBlbnRpdHkpO1xufTtcblxuZXhwb3J0cy5QaXBlID0gUGlwZTtcbiIsInZhciBncmFwaGljc1N5c3RlbSA9IHJlcXVpcmUoJy4vc3lzdGVtcy9ncmFwaGljcycpO1xudmFyIHBoeXNpY3NTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbXMvcGh5c2ljcycpO1xudmFyIGlucHV0U3lzdGVtID0gcmVxdWlyZSgnLi9zeXN0ZW1zL2lucHV0Jyk7XG52YXIgcGlwZXNTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbXMvcGlwZXMnKTtcbnZhciBiaXJkID0gcmVxdWlyZSgnLi9lbnRpdGllcy9iaXJkJyk7XG52YXIgcGlwZSA9IHJlcXVpcmUoJy4vZW50aXRpZXMvcGlwZScpO1xudmFyIGdyb3VuZCA9IHJlcXVpcmUoJy4vZW50aXRpZXMvZ3JvdW5kJyk7XG52YXIgZWRnZSA9IHJlcXVpcmUoJy4vZW50aXRpZXMvZWRnZScpO1xuXG52YXIgRmxhcHB5QmlyZCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmVudGl0aWVzID0gW25ldyBiaXJkLkJpcmQoKSwgbmV3IHBpcGUuUGlwZSh7IHg6IDEsIHk6IDAgfSksIG5ldyBwaXBlLlBpcGUoeyB4OiAxLCB5OiAwLjYgfSksIG5ldyBncm91bmQuR3JvdW5kKCksIG5ldyBlZGdlLkVkZ2UoKV07XG5cdHRoaXMuZ3JhcGhpY3MgPSBuZXcgZ3JhcGhpY3NTeXN0ZW0uR3JhcGhpY3NTeXN0ZW0odGhpcy5lbnRpdGllcyk7XG5cdHRoaXMucGh5c2ljcyA9IG5ldyBwaHlzaWNzU3lzdGVtLlBoeXNpY3NTeXN0ZW0odGhpcy5lbnRpdGllcyk7XG5cdHRoaXMuaW5wdXQgPSBuZXcgaW5wdXRTeXN0ZW0uSW5wdXRTeXN0ZW0odGhpcy5lbnRpdGllcyk7XG5cdHRoaXMucGlwZXMgPSBuZXcgcGlwZXNTeXN0ZW0uUGlwZXNTeXN0ZW0odGhpcy5lbnRpdGllcyk7XG59O1xuXG5GbGFwcHlCaXJkLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbigpIHtcblx0dGhpcy5ncmFwaGljcy5ydW4oKTtcblx0dGhpcy5waHlzaWNzLnJ1bigpO1xuXHR0aGlzLmlucHV0LnJ1bigpO1xuXHR0aGlzLnBpcGVzLnJ1bigpO1xufTtcblxuZXhwb3J0cy5GbGFwcHlCaXJkID0gRmxhcHB5QmlyZDtcbiIsInZhciBmbGFwcHlCaXJkID0gcmVxdWlyZSgnLi9mbGFwcHlfYmlyZCcpO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG5cdHZhciBhcHAgPSBuZXcgZmxhcHB5QmlyZC5GbGFwcHlCaXJkKCk7XG5cdGFwcC5ydW4oKTtcbn0pO1xuIiwidmFyIHBpcGUgPSByZXF1aXJlKCcuLi9lbnRpdGllcy9waXBlJyk7XG52YXIgYmlyZCA9IHJlcXVpcmUoJy4uL2VudGl0aWVzL2JpcmQnKTtcbnZhciBlZGdlID0gcmVxdWlyZSgnLi4vZW50aXRpZXMvZWRnZScpO1xuXG52YXIgQ29sbGlzaW9uU3lzdGVtID0gZnVuY3Rpb24oZW50aXRpZXMpIHtcblx0dGhpcy5lbnRpdGllcyA9IGVudGl0aWVzO1xufTtcblxuQ29sbGlzaW9uU3lzdGVtLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBlbnRpdHlBID0gdGhpcy5lbnRpdGllc1tpXTtcblx0XHRpZiAoISgnY29sbGlzaW9uJyBpbiBlbnRpdHlBLmNvbXBvbmVudHMpKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBqID0gaSsxOyBqIDwgdGhpcy5lbnRpdGllcy5sZW5ndGg7IGorKykge1xuXHRcdFx0dmFyIGVudGl0eUIgPSB0aGlzLmVudGl0aWVzW2pdO1xuXHRcdFx0aWYgKCEoJ2NvbGxpc2lvbicgaW4gZW50aXR5Qi5jb21wb25lbnRzKSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCEoZW50aXR5QS5jb21wb25lbnRzLmNvbGxpc2lvbi5jb2xsaWRlc1dpdGgoZW50aXR5QikpKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZW50aXR5QS5jb21wb25lbnRzLmNvbGxpc2lvbi5vbkNvbGxpc2lvbikge1xuXHRcdFx0XHRlbnRpdHlBLmNvbXBvbmVudHMuY29sbGlzaW9uLm9uQ29sbGlzaW9uKGVudGl0eUIpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZW50aXR5Qi5jb21wb25lbnRzLmNvbGxpc2lvbi5vbkNvbGxpc2lvbikge1xuXHRcdFx0XHRlbnRpdHlCLmNvbXBvbmVudHMuY29sbGlzaW9uLm9uQ29sbGlzaW9uKGVudGl0eUEpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZW50aXR5QSBpbnN0YW5jZW9mIGJpcmQuQmlyZCB8fCBlbnRpdHlCIGluc3RhbmNlb2YgYmlyZC5CaXJkKSB7XG5cdFx0XHRcdHRoaXMucmVtb3ZlUGlwZXMoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGVudGl0eUEgaW5zdGFuY2VvZiBlZGdlLkVkZ2UpIHtcblx0XHRcdFx0dGhpcy5yZW1vdmVFbnRpdHkoZW50aXR5Qik7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlbnRpdHlCIGluc3RhbmNlb2YgZWRnZS5FZGdlKSB7XG5cdFx0XHRcdHRoaXMucmVtb3ZlRW50aXR5KGVudGl0eUEpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuQ29sbGlzaW9uU3lzdGVtLnByb3RvdHlwZS5yZW1vdmVQaXBlcyA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcblx0Ly8gTG9vcCBvdmVyIHRoZSBleGlzdGluZyBwaXBlcyAmIHJlbW92ZSB0aGVtXG5cdHZhciBlbnRpdGllc0NvcHkgPSB0aGlzLmVudGl0aWVzLnNsaWNlKCk7ICAgLy8gY29weSB0aGUgYXJyYXlcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBlbnRpdGllc0NvcHkubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAoZW50aXRpZXNDb3B5W2ldIGluc3RhbmNlb2YgcGlwZS5QaXBlKSB7XG5cdFx0XHQvLyBSZW1vdmUgdGhlIHBpcGUgZnJvbSB0aGUgYXJyYXlcblx0XHRcdHRoaXMucmVtb3ZlRW50aXR5KGVudGl0aWVzQ29weVtpXSk7XG5cdFx0fVxuXHR9XG59O1xuXG5Db2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLnJlbW92ZUVudGl0eSA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHQvLyBSZW1vdmUgdGhlIGZpcnN0IHR3byBwaXBlcyBmcm9tIHRoZSBhcnJheVxuXHRjb25zb2xlLmxvZygnSW4gcmVtb3ZlRW50aXR5Jyk7XG5cdHRoaXMuZW50aXRpZXMuc3BsaWNlKHRoaXMuZW50aXRpZXMuaW5kZXhPZihlbnRpdHkpLCAxKTtcbn07XG5cbmV4cG9ydHMuQ29sbGlzaW9uU3lzdGVtID0gQ29sbGlzaW9uU3lzdGVtO1xuIiwidmFyIEdyYXBoaWNzU3lzdGVtID0gZnVuY3Rpb24oZW50aXRpZXMpIHtcblx0dGhpcy5lbnRpdGllcyA9IGVudGl0aWVzO1x0Ly8gW0JpcmQsIFBpcGUsIFBpcGVdXG5cdC8vIENhbnZhcyBpcyB3aGVyZSB3ZSBkcmF3XG5cdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY2FudmFzJyk7XG5cdC8vIENhbnZhcyBpcyB3aGF0IHdlIGRyYXcgdG9cblx0dGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbn07XG5cbkdyYXBoaWNzU3lzdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbigpIHtcblx0Ly8gUnVuIHRoZSByZW5kZXIgbG9vcFxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcbn07XG5cbkdyYXBoaWNzU3lzdGVtLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oKSB7XG5cdC8vIFNldCB0aGUgY2FudmFzIHRvIHRoZSBjb3JyZWN0IHNpemUgaWYgdGhlIHdpbmRvdyBpcyByZXNpemVkXG5cdGlmICh0aGlzLmNhbnZhcy53aWR0aCAhPSB0aGlzLmNhbnZhcy5vZmZzZXRXaWR0aCB8fFxuXHRcdHRoaXMuY2FudmFzLmhlaWdodCAhPSB0aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQpIHtcblx0XHRcdHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXMub2Zmc2V0V2lkdGg7XG5cdFx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQ7XG5cdFx0fVxuXG5cdC8vIENsZWFyIHRoZSBjYW52YXNcblx0dGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblxuXHR0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXHR0aGlzLmNvbnRleHQudHJhbnNsYXRlKHRoaXMuY2FudmFzLndpZHRoIC8gMiwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblx0dGhpcy5jb250ZXh0LnNjYWxlKHRoaXMuY2FudmFzLmhlaWdodCwgLXRoaXMuY2FudmFzLmhlaWdodCk7XHQvL2ZsaXBzIHRoZSB5IGNvb3JkXG5cblx0Ly8gUmVuZGVyaW5nIGdvZXMgaGVyZVxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZW50aXR5ID0gdGhpcy5lbnRpdGllc1tpXTtcblx0XHRpZiAoISgnZ3JhcGhpY3MnIGluIGVudGl0eS5jb21wb25lbnRzKSkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGVudGl0eS5jb21wb25lbnRzLmdyYXBoaWNzLmRyYXcodGhpcy5jb250ZXh0KTtcblx0fVxuXG5cdHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG5cblx0Ly8gQ29udGludWUgdGhlIHJlbmRlciBsb29wXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xufTtcblxuZXhwb3J0cy5HcmFwaGljc1N5c3RlbSA9IEdyYXBoaWNzU3lzdGVtO1xuIiwidmFyIElucHV0U3lzdGVtID0gZnVuY3Rpb24oZW50aXRpZXMpIHtcblx0dGhpcy5lbnRpdGllcyA9IGVudGl0aWVzO1xuXG5cdC8vIENhbnZhcyBpcyB3aGVyZSB3ZSBnZXQgaW5wdXQgZnJvbVxuXHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNhbnZhcycpO1xufTtcblxuSW5wdXRTeXN0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljay5iaW5kKHRoaXMpKTtcbn07XG5cbklucHV0U3lzdGVtLnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdHZhciBiaXJkID0gdGhpcy5lbnRpdGllc1swXTtcblx0YmlyZC5jb21wb25lbnRzLnBoeXNpY3MudmVsb2NpdHkueSA9IDAuNjtcbn07XG5cbmV4cG9ydHMuSW5wdXRTeXN0ZW0gPSBJbnB1dFN5c3RlbTtcbiIsInZhciBjb2xsaXNpb25TeXN0ZW0gPSByZXF1aXJlKFwiLi9jb2xsaXNpb25cIik7XG5cbnZhciBQaHlzaWNzU3lzdGVtID0gZnVuY3Rpb24oZW50aXRpZXMpIHtcblx0dGhpcy5lbnRpdGllcyA9IGVudGl0aWVzO1xuXHR0aGlzLmNvbGxpc2lvblN5c3RlbSA9IG5ldyBjb2xsaXNpb25TeXN0ZW0uQ29sbGlzaW9uU3lzdGVtKGVudGl0aWVzKTtcbn07XG5cblBoeXNpY3NTeXN0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuXHQvLyBSdW4gdGhlIHVwZGF0ZSBsb29wXG5cdHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLnRpY2suYmluZCh0aGlzKSwgMTAwMCAvIDYwKTtcbn07XG5cblBoeXNpY3NTeXN0ZW0ucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbigpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGVudGl0eSA9IHRoaXMuZW50aXRpZXNbaV07XG5cdFx0aWYgKCEoJ3BoeXNpY3MnIGluIGVudGl0eS5jb21wb25lbnRzKSkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGVudGl0eS5jb21wb25lbnRzLnBoeXNpY3MudXBkYXRlKDEvNjApO1xuXHR9XG5cdHRoaXMuY29sbGlzaW9uU3lzdGVtLnRpY2soKTtcbn07XG5cbmV4cG9ydHMuUGh5c2ljc1N5c3RlbSA9IFBoeXNpY3NTeXN0ZW07XG4iLCJ2YXIgcGlwZSA9IHJlcXVpcmUoJy4uL2VudGl0aWVzL3BpcGUnKTtcblxudmFyIFBpcGVzU3lzdGVtID0gZnVuY3Rpb24oZW50aXRpZXMpIHtcblx0dGhpcy5lbnRpdGllcyA9IGVudGl0aWVzO1xufTtcblxuUGlwZXNTeXN0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuXHQvLyBSdW4gdGhlIHVwZGF0ZSBsb29wXG5cdHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLnRpY2suYmluZCh0aGlzKSwgNDAwMCk7XG59O1xuXG5QaXBlc1N5c3RlbS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZygnSW4gUGlwZXNTeXN0ZW0nKTtcblx0dmFyIHBpcGVCb3R0b20gPSBuZXcgcGlwZS5QaXBlKHsgeDogMSwgeTogMCB9KTtcblx0dmFyIHBpcGVUb3AgPSBuZXcgcGlwZS5QaXBlKHsgeDogMSwgeTogMC42IH0pO1xuXHR0aGlzLmVudGl0aWVzLnB1c2gocGlwZUJvdHRvbSwgcGlwZVRvcCk7XG59O1xuXG5leHBvcnRzLlBpcGVzU3lzdGVtID0gUGlwZXNTeXN0ZW07XG4iXX0=
