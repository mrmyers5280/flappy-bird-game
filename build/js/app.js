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
	physics.acceleration.y = -2;	// How strong gravity is

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
	entity.components.graphics.draw(this.context);
};

exports.Bird = Bird;

},{"../components/collision/circle":1,"../components/graphics/bird":3,"../components/physics/physics":5}],7:[function(require,module,exports){
var graphicsComponent = require("../components/graphics/pipe");
var physicsComponent = require("../components/physics/physics");
var collisionComponent = require("../components/collision/rect");
// var settings = require("../settings");

var Pipe = function(position) {
	// console.log("Creating Pipe entity");
	var physics = new physicsComponent.PhysicsComponent(this);
	physics.position.x = position.x;
	physics.position.y = position.y;
	physics.velocity.x = -0.1;	// move the pipes towards the bird

	var graphics = new graphicsComponent.PipeGraphicsComponent(this);
	var collision = new collisionComponent.RectCollisionComponent(this, {x: 0.1, y: 0.4});
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

},{"../components/collision/rect":2,"../components/graphics/pipe":4,"../components/physics/physics":5}],8:[function(require,module,exports){
var graphicsSystem = require('./systems/graphics');
var physicsSystem = require('./systems/physics');
var inputSystem = require('./systems/input');
var pipesSystem = require('./systems/pipes');
var bird = require('./entities/bird');
var pipe = require('./entities/pipe');

var FlappyBird = function() {
	this.entities = [new bird.Bird(), new pipe.Pipe({ x: 1, y: 0 }), new pipe.Pipe({ x: 1, y: 0.6 })];
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

},{"./entities/bird":6,"./entities/pipe":7,"./systems/graphics":11,"./systems/input":12,"./systems/physics":13,"./systems/pipes":14}],9:[function(require,module,exports){
var flappyBird = require('./flappy_bird');

document.addEventListener('DOMContentLoaded', function() {
	var app = new flappyBird.FlappyBird();
	app.run();
});

},{"./flappy_bird":8}],10:[function(require,module,exports){
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
		}
	}
};

exports.CollisionSystem = CollisionSystem;

},{}],11:[function(require,module,exports){
var GraphicsSystem = function(entities) {
	this.entities = entities;
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"./collision":10}],14:[function(require,module,exports){
var pipe = require('../entities/pipe');

var PipesSystem = function(entities) {
	this.entities = entities;
};

PipesSystem.prototype.run = function() {
	// Run the update loop
	window.setInterval(this.tick.bind(this), 2000);
};

PipesSystem.prototype.tick = function() {
	console.log('In PipesSystem');
	var pipeBottom = new pipe.Pipe({ x: 1, y: 0 });
	var pipeTop = new pipe.Pipe({ x: 1, y: 0.6 });
	this.entities.push(pipeBottom, pipeTop);
};

exports.PipesSystem = PipesSystem;

},{"../entities/pipe":7}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jb21wb25lbnRzL2NvbGxpc2lvbi9jaXJjbGUuanMiLCJqcy9jb21wb25lbnRzL2NvbGxpc2lvbi9yZWN0LmpzIiwianMvY29tcG9uZW50cy9ncmFwaGljcy9iaXJkLmpzIiwianMvY29tcG9uZW50cy9ncmFwaGljcy9waXBlLmpzIiwianMvY29tcG9uZW50cy9waHlzaWNzL3BoeXNpY3MuanMiLCJqcy9lbnRpdGllcy9iaXJkLmpzIiwianMvZW50aXRpZXMvcGlwZS5qcyIsImpzL2ZsYXBweV9iaXJkLmpzIiwianMvbWFpbi5qcyIsImpzL3N5c3RlbXMvY29sbGlzaW9uLmpzIiwianMvc3lzdGVtcy9ncmFwaGljcy5qcyIsImpzL3N5c3RlbXMvaW5wdXQuanMiLCJqcy9zeXN0ZW1zL3BoeXNpY3MuanMiLCJqcy9zeXN0ZW1zL3BpcGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIENpcmNsZUNvbGxpc2lvbkNvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSwgcmFkaXVzKSB7XG5cdHRoaXMuZW50aXR5ID0gZW50aXR5O1xuXHR0aGlzLnJhZGl1cyA9IHJhZGl1cztcblx0dGhpcy50eXBlID0gJ2NpcmNsZSc7XG59O1xuXG5DaXJjbGVDb2xsaXNpb25Db21wb25lbnQucHJvdG90eXBlLmNvbGxpZGVzV2l0aCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHRpZiAoZW50aXR5LmNvbXBvbmVudHMuY29sbGlzaW9uLnR5cGUgPT0gJ2NpcmNsZScpIHtcblx0XHRyZXR1cm4gdGhpcy5jb2xsaWRlQ2lyY2xlKGVudGl0eSk7XG5cdH1cblx0ZWxzZSBpZiAoZW50aXR5LmNvbXBvbmVudHMuY29sbGlzaW9uLnR5cGUgPT0gJ3JlY3QnKSB7XG5cdFx0cmV0dXJuIHRoaXMuY29sbGlkZVJlY3QoZW50aXR5KTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5DaXJjbGVDb2xsaXNpb25Db21wb25lbnQucHJvdG90eXBlLmNvbGxpZGVDaXJjbGUgPSBmdW5jdGlvbihlbnRpdHkpIHtcblx0dmFyIHBvc2l0aW9uQSA9IHRoaXMuZW50aXR5LmNvbXBvbmVudHMucGh5c2ljcy5wb3NpdGlvbjtcblx0dmFyIHBvc2l0aW9uQiA9IGVudGl0eS5jb21wb25lbnRzLnBoeXNpY3MucG9zaXRpb247IC8vIFdoYXQgZW50aXR5IGlzIHRoaXM/XG5cblx0dmFyIHJhZGl1c0EgPSB0aGlzLnJhZGl1cztcblx0dmFyIHJhZGl1c0IgPSBlbnRpdHkuY29tcG9uZW50cy5jb2xsaXNpb24ucmFkaXVzO1xuXG5cdHZhciBkaWZmID0ge3g6IHBvc2l0aW9uQS54IC0gcG9zaXRpb25CLngsXG5cdFx0XHRcdHk6IHBvc2l0aW9uQS55IC0gcG9zaXRpb25CLnl9O1xuXG5cdHZhciBkaXN0YW5jZVNxdWFyZWQgPSBkaWZmLnggKiBkaWZmLnggKyBkaWZmLnkgKiBkaWZmLnk7XG5cdHZhciByYWRpdXNTdW0gPSByYWRpdXNBICsgcmFkaXVzQjtcblxuXHRyZXR1cm4gZGlzdGFuY2VTcXVhcmVkIDwgcmFkaXVzU3VtICogcmFkaXVzU3VtO1xufTtcblxuQ2lyY2xlQ29sbGlzaW9uQ29tcG9uZW50LnByb3RvdHlwZS5jb2xsaWRlUmVjdCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHR2YXIgY2xhbXAgPSBmdW5jdGlvbih2YWx1ZSwgbG93LCBoaWdoKSB7XG5cdFx0aWYgKHZhbHVlIDwgbG93KSB7XG5cdFx0XHRyZXR1cm4gbG93O1xuXHRcdH1cblx0XHRpZiAodmFsdWUgPiBoaWdoKSB7XG5cdFx0XHRyZXR1cm4gaGlnaDtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9O1xuXG5cdHZhciBwb3NpdGlvbkEgPSB0aGlzLmVudGl0eS5jb21wb25lbnRzLnBoeXNpY3MucG9zaXRpb247XG5cdHZhciBwb3NpdGlvbkIgPSBlbnRpdHkuY29tcG9uZW50cy5waHlzaWNzLnBvc2l0aW9uO1xuXHR2YXIgc2l6ZUIgPSBlbnRpdHkuY29tcG9uZW50cy5jb2xsaXNpb24uc2l6ZTtcblxuXHR2YXIgY2xvc2VzdCA9IHtcblx0XHR4OiBjbGFtcChwb3NpdGlvbkEueCwgcG9zaXRpb25CLngsXG5cdFx0XHRcdHBvc2l0aW9uQi54ICsgc2l6ZUIueCksXG5cdFx0eTogY2xhbXAocG9zaXRpb25BLnksIHBvc2l0aW9uQi55LFxuXHRcdFx0XHRwb3NpdGlvbkIueSArIHNpemVCLnkpXG5cdH07XG5cblx0dmFyIHJhZGl1c0EgPSB0aGlzLnJhZGl1cztcblxuXHR2YXIgZGlmZiA9IHt4OiBwb3NpdGlvbkEueCAtIGNsb3Nlc3QueCxcblx0XHRcdFx0eTogcG9zaXRpb25BLnkgLSBjbG9zZXN0Lnl9O1xuXG5cdHZhciBkaXN0YW5jZVNxdWFyZWQgPSBkaWZmLnggKiBkaWZmLnggKyBkaWZmLnkgKiBkaWZmLnk7XG5cdHJldHVybiBkaXN0YW5jZVNxdWFyZWQgPCByYWRpdXNBICogcmFkaXVzQTsgICAgLy8gaGFzIHRoZXJlIGJlZW4gYSBjb2xsaXNpb25cbn07XG5cbmV4cG9ydHMuQ2lyY2xlQ29sbGlzaW9uQ29tcG9uZW50ID0gQ2lyY2xlQ29sbGlzaW9uQ29tcG9uZW50O1xuIiwidmFyIFJlY3RDb2xsaXNpb25Db21wb25lbnQgPSBmdW5jdGlvbihlbnRpdHksIHNpemUpIHtcblx0dGhpcy5lbnRpdHkgPSBlbnRpdHk7XG5cdHRoaXMuc2l6ZSA9IHNpemU7XG5cdHRoaXMudHlwZSA9ICdyZWN0Jztcbn07XG5cblJlY3RDb2xsaXNpb25Db21wb25lbnQucHJvdG90eXBlLmNvbGxpZGVzV2l0aCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHRpZiAoZW50aXR5LmNvbXBvbmVudHMuY29sbGlzaW9uLnR5cGUgPT0gJ2NpcmNsZScpIHtcblx0XHRyZXR1cm4gdGhpcy5jb2xsaWRlQ2lyY2xlKGVudGl0eSk7XG5cdH1cblx0ZWxzZSBpZiAoZW50aXR5LmNvbXBvbmVudHMuY29sbGlzaW9uLnR5cGUgPT0gJ3JlY3QnKSB7XG5cdFx0cmV0dXJuIHRoaXMuY29sbGlkZVJlY3QoZW50aXR5KTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5SZWN0Q29sbGlzaW9uQ29tcG9uZW50LnByb3RvdHlwZS5jb2xsaWRlQ2lyY2xlID0gZnVuY3Rpb24oZW50aXR5KSB7XG5cdHJldHVybiBlbnRpdHkuY29tcG9uZW50cy5jb2xsaXNpb24uY29sbGlkZVJlY3QodGhpcy5lbnRpdHkpO1xufTtcblxuUmVjdENvbGxpc2lvbkNvbXBvbmVudC5wcm90b3R5cGUuY29sbGlkZVJlY3QgPSBmdW5jdGlvbihlbnRpdHkpIHtcblx0dmFyIHBvc2l0aW9uQSA9IHRoaXMuZW50aXR5LmNvbXBvbmVudHMucGh5c2ljcy5wb3NpdGlvbjtcblx0dmFyIHBvc2l0aW9uQiA9IGVudGl0eS5jb21wb25lbnRzLnBoeXNpY3MucG9zaXRpb247XG5cblx0dmFyIHNpemVBID0gdGhpcy5zaXplO1xuXHR2YXIgc2l6ZUIgPSBlbnRpdHkuY29tcG9uZW50cy5jb2xsaXNpb24uc2l6ZTtcblxuXHR2YXIgbGVmdEEgPSBwb3NpdGlvbkEueCAtIHNpemVBLnggLyAyO1xuXHR2YXIgcmlnaHRBID0gcG9zaXRpb25BLnggKyBzaXplQS54IC8gMjtcblx0dmFyIGJvdHRvbUEgPSBwb3NpdGlvbkEueSAtIHNpemVBLnkgLyAyO1xuXHR2YXIgdG9wQSA9IHBvc2l0aW9uQS55ICsgc2l6ZUEueSAvIDI7XG5cblx0dmFyIGxlZnRCID0gcG9zaXRpb25CLnggLSBzaXplQi54IC8gMjtcblx0dmFyIHJpZ2h0QiA9IHBvc2l0aW9uQi54ICsgc2l6ZUIueCAvIDI7XG5cdHZhciBib3R0b21CID0gcG9zaXRpb25CLnkgLSBzaXplQi55IC8gMjtcblx0dmFyIHRvcEIgPSBwb3NpdGlvbkIueSArIHNpemVCLnkgLyAyO1xuXG5cdHJldHVybiAhKGxlZnRBID4gcmlnaHRCIHx8IGxlZnRCID4gcmlnaHRBIHx8XG5cdFx0XHRib3R0b21BID4gdG9wQiB8fCBib3R0b21CID4gdG9wQSk7XG59O1xuXG5leHBvcnRzLlJlY3RDb2xsaXNpb25Db21wb25lbnQgPSBSZWN0Q29sbGlzaW9uQ29tcG9uZW50O1xuIiwidmFyIEJpcmRHcmFwaGljc0NvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHR0aGlzLmVudGl0eSA9IGVudGl0eTtcbn07XG5cbkJpcmRHcmFwaGljc0NvbXBvbmVudC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcblx0dmFyIHBvc2l0aW9uID0gdGhpcy5lbnRpdHkuY29tcG9uZW50cy5waHlzaWNzLnBvc2l0aW9uO1xuXG5cdGNvbnRleHQuc2F2ZSgpO1xuXHRjb250ZXh0LnRyYW5zbGF0ZShwb3NpdGlvbi54LCBwb3NpdGlvbi55KTtcblx0Y29udGV4dC5iZWdpblBhdGgoKTtcblx0Y29udGV4dC5hcmMoMCwgMCwgMC4wMiwgMCwgMiAqIE1hdGguUEkpO1xuXHRjb250ZXh0LmZpbGwoKTtcblx0Y29udGV4dC5jbG9zZVBhdGgoKTtcblx0Y29udGV4dC5yZXN0b3JlKCk7XG59O1xuXG5leHBvcnRzLkJpcmRHcmFwaGljc0NvbXBvbmVudCA9IEJpcmRHcmFwaGljc0NvbXBvbmVudDtcbiIsInZhciBQaXBlR3JhcGhpY3NDb21wb25lbnQgPSBmdW5jdGlvbihlbnRpdHkpIHtcblx0dGhpcy5lbnRpdHkgPSBlbnRpdHk7XG59O1xuXG5QaXBlR3JhcGhpY3NDb21wb25lbnQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjb250ZXh0KSB7XG5cdHZhciBwb3NpdGlvbiA9IHRoaXMuZW50aXR5LmNvbXBvbmVudHMucGh5c2ljcy5wb3NpdGlvbjtcblx0Ly8gdmFyIHBvc2l0aW9uID0geyB4OiAxLCB5OiAwIH07XG5cblx0Y29udGV4dC5zYXZlKCk7XG5cdGNvbnRleHQudHJhbnNsYXRlKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRjb250ZXh0LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcblx0Y29udGV4dC5maWxsUmVjdCgwLCAwLCAwLjEsIDAuNCk7XG5cdGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cdGNvbnRleHQucmVzdG9yZSgpO1xufTtcblxuZXhwb3J0cy5QaXBlR3JhcGhpY3NDb21wb25lbnQgPSBQaXBlR3JhcGhpY3NDb21wb25lbnQ7XG4iLCJ2YXIgUGh5c2ljc0NvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHR0aGlzLmVudGl0eSA9IGVudGl0eTtcblxuXHR0aGlzLnBvc2l0aW9uID0ge1xuXHRcdHg6IDAsXG5cdFx0eTogMFxuXHR9O1xuXHR0aGlzLnZlbG9jaXR5ID0ge1xuXHRcdHg6IDAsXG5cdFx0eTogMFxuXHR9O1xuXHR0aGlzLmFjY2VsZXJhdGlvbiA9IHtcblx0XHR4OiAwLFxuXHRcdHk6IDBcblx0fTtcbn07XG5cblBoeXNpY3NDb21wb25lbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRlbHRhKSB7XG5cdHRoaXMudmVsb2NpdHkueCArPSB0aGlzLmFjY2VsZXJhdGlvbi54ICogZGVsdGE7XG5cdHRoaXMudmVsb2NpdHkueSArPSB0aGlzLmFjY2VsZXJhdGlvbi55ICogZGVsdGE7XG5cblx0dGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueCAqIGRlbHRhO1xuXHR0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogZGVsdGE7XG59O1xuXG5leHBvcnRzLlBoeXNpY3NDb21wb25lbnQgPSBQaHlzaWNzQ29tcG9uZW50O1xuIiwidmFyIGdyYXBoaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvZ3JhcGhpY3MvYmlyZFwiKTtcbnZhciBwaHlzaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvcGh5c2ljcy9waHlzaWNzXCIpO1xudmFyIGNvbGxpc2lvbkNvbXBvbmVudCA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2NvbGxpc2lvbi9jaXJjbGVcIik7XG4vLyB2YXIgc2V0dGluZ3MgPSByZXF1aXJlKFwiLi4vc2V0dGluZ3NcIik7XG5cbnZhciBCaXJkID0gZnVuY3Rpb24oKSB7XG5cdC8vIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgQmlyZCBFbnRpdHlcIik7XG5cdHZhciBwaHlzaWNzID0gbmV3IHBoeXNpY3NDb21wb25lbnQuUGh5c2ljc0NvbXBvbmVudCh0aGlzKTtcblx0cGh5c2ljcy5wb3NpdGlvbi55ID0gMC41O1xuXHRwaHlzaWNzLmFjY2VsZXJhdGlvbi55ID0gLTI7XHQvLyBIb3cgc3Ryb25nIGdyYXZpdHkgaXNcblxuXHR2YXIgZ3JhcGhpY3MgPSBuZXcgZ3JhcGhpY3NDb21wb25lbnQuQmlyZEdyYXBoaWNzQ29tcG9uZW50KHRoaXMpO1xuXHR2YXIgY29sbGlzaW9uID0gbmV3IGNvbGxpc2lvbkNvbXBvbmVudC5DaXJjbGVDb2xsaXNpb25Db21wb25lbnQodGhpcywgMC4wMik7XG5cdGNvbGxpc2lvbi5vbkNvbGxpc2lvbiA9IHRoaXMub25Db2xsaXNpb24uYmluZCh0aGlzKTtcblxuXHR0aGlzLmNvbXBvbmVudHMgPSB7XG5cdFx0cGh5c2ljczogcGh5c2ljcyxcblx0XHRncmFwaGljczogZ3JhcGhpY3MsXG5cdFx0Y29sbGlzaW9uOiBjb2xsaXNpb25cblx0fTtcbn07XG5cbkJpcmQucHJvdG90eXBlLm9uQ29sbGlzaW9uID0gZnVuY3Rpb24oZW50aXR5KSB7XG5cdGNvbnNvbGUubG9nKFwiQmlyZCBjb2xsaWRlZCB3aXRoIGVudGl0eTogXCIsIGVudGl0eSk7XG5cdC8vIFJlc2V0IGJpcmQgdG8gbWlkZGxlICh4PTAsIHk9MC41KVxuXHRlbnRpdHkuY29tcG9uZW50cy5ncmFwaGljcy5kcmF3KHRoaXMuY29udGV4dCk7XG59O1xuXG5leHBvcnRzLkJpcmQgPSBCaXJkO1xuIiwidmFyIGdyYXBoaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvZ3JhcGhpY3MvcGlwZVwiKTtcbnZhciBwaHlzaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvcGh5c2ljcy9waHlzaWNzXCIpO1xudmFyIGNvbGxpc2lvbkNvbXBvbmVudCA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2NvbGxpc2lvbi9yZWN0XCIpO1xuLy8gdmFyIHNldHRpbmdzID0gcmVxdWlyZShcIi4uL3NldHRpbmdzXCIpO1xuXG52YXIgUGlwZSA9IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG5cdC8vIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgUGlwZSBlbnRpdHlcIik7XG5cdHZhciBwaHlzaWNzID0gbmV3IHBoeXNpY3NDb21wb25lbnQuUGh5c2ljc0NvbXBvbmVudCh0aGlzKTtcblx0cGh5c2ljcy5wb3NpdGlvbi54ID0gcG9zaXRpb24ueDtcblx0cGh5c2ljcy5wb3NpdGlvbi55ID0gcG9zaXRpb24ueTtcblx0cGh5c2ljcy52ZWxvY2l0eS54ID0gLTAuMTtcdC8vIG1vdmUgdGhlIHBpcGVzIHRvd2FyZHMgdGhlIGJpcmRcblxuXHR2YXIgZ3JhcGhpY3MgPSBuZXcgZ3JhcGhpY3NDb21wb25lbnQuUGlwZUdyYXBoaWNzQ29tcG9uZW50KHRoaXMpO1xuXHR2YXIgY29sbGlzaW9uID0gbmV3IGNvbGxpc2lvbkNvbXBvbmVudC5SZWN0Q29sbGlzaW9uQ29tcG9uZW50KHRoaXMsIHt4OiAwLjEsIHk6IDAuNH0pO1xuXHRjb2xsaXNpb24ub25Db2xsaXNpb24gPSB0aGlzLm9uQ29sbGlzaW9uLmJpbmQodGhpcyk7XG5cblx0dGhpcy5jb21wb25lbnRzID0ge1xuXHRcdHBoeXNpY3M6IHBoeXNpY3MsXG5cdFx0Z3JhcGhpY3M6IGdyYXBoaWNzLFxuXHRcdGNvbGxpc2lvbjogY29sbGlzaW9uXG5cdH07XG59O1xuXG5QaXBlLnByb3RvdHlwZS5vbkNvbGxpc2lvbiA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHRjb25zb2xlLmxvZyhcIlBpcGUgY29sbGlkZWQgd2l0aCBlbnRpdHk6IFwiLCBlbnRpdHkpO1xufTtcblxuZXhwb3J0cy5QaXBlID0gUGlwZTtcbiIsInZhciBncmFwaGljc1N5c3RlbSA9IHJlcXVpcmUoJy4vc3lzdGVtcy9ncmFwaGljcycpO1xudmFyIHBoeXNpY3NTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbXMvcGh5c2ljcycpO1xudmFyIGlucHV0U3lzdGVtID0gcmVxdWlyZSgnLi9zeXN0ZW1zL2lucHV0Jyk7XG52YXIgcGlwZXNTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbXMvcGlwZXMnKTtcbnZhciBiaXJkID0gcmVxdWlyZSgnLi9lbnRpdGllcy9iaXJkJyk7XG52YXIgcGlwZSA9IHJlcXVpcmUoJy4vZW50aXRpZXMvcGlwZScpO1xuXG52YXIgRmxhcHB5QmlyZCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmVudGl0aWVzID0gW25ldyBiaXJkLkJpcmQoKSwgbmV3IHBpcGUuUGlwZSh7IHg6IDEsIHk6IDAgfSksIG5ldyBwaXBlLlBpcGUoeyB4OiAxLCB5OiAwLjYgfSldO1xuXHR0aGlzLmdyYXBoaWNzID0gbmV3IGdyYXBoaWNzU3lzdGVtLkdyYXBoaWNzU3lzdGVtKHRoaXMuZW50aXRpZXMpO1xuXHR0aGlzLnBoeXNpY3MgPSBuZXcgcGh5c2ljc1N5c3RlbS5QaHlzaWNzU3lzdGVtKHRoaXMuZW50aXRpZXMpO1xuXHR0aGlzLmlucHV0ID0gbmV3IGlucHV0U3lzdGVtLklucHV0U3lzdGVtKHRoaXMuZW50aXRpZXMpO1xuXHR0aGlzLnBpcGVzID0gbmV3IHBpcGVzU3lzdGVtLlBpcGVzU3lzdGVtKHRoaXMuZW50aXRpZXMpO1xufTtcblxuRmxhcHB5QmlyZC5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuZ3JhcGhpY3MucnVuKCk7XG5cdHRoaXMucGh5c2ljcy5ydW4oKTtcblx0dGhpcy5pbnB1dC5ydW4oKTtcblx0dGhpcy5waXBlcy5ydW4oKTtcbn07XG5cbmV4cG9ydHMuRmxhcHB5QmlyZCA9IEZsYXBweUJpcmQ7XG4iLCJ2YXIgZmxhcHB5QmlyZCA9IHJlcXVpcmUoJy4vZmxhcHB5X2JpcmQnKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuXHR2YXIgYXBwID0gbmV3IGZsYXBweUJpcmQuRmxhcHB5QmlyZCgpO1xuXHRhcHAucnVuKCk7XG59KTtcbiIsInZhciBDb2xsaXNpb25TeXN0ZW0gPSBmdW5jdGlvbihlbnRpdGllcykge1xuXHR0aGlzLmVudGl0aWVzID0gZW50aXRpZXM7XG59O1xuXG5Db2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbigpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGVudGl0eUEgPSB0aGlzLmVudGl0aWVzW2ldO1xuXHRcdGlmICghKCdjb2xsaXNpb24nIGluIGVudGl0eUEuY29tcG9uZW50cykpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGogPSBpKzE7IGogPCB0aGlzLmVudGl0aWVzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHR2YXIgZW50aXR5QiA9IHRoaXMuZW50aXRpZXNbal07XG5cdFx0XHRpZiAoISgnY29sbGlzaW9uJyBpbiBlbnRpdHlCLmNvbXBvbmVudHMpKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIShlbnRpdHlBLmNvbXBvbmVudHMuY29sbGlzaW9uLmNvbGxpZGVzV2l0aChlbnRpdHlCKSkpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlbnRpdHlBLmNvbXBvbmVudHMuY29sbGlzaW9uLm9uQ29sbGlzaW9uKSB7XG5cdFx0XHRcdGVudGl0eUEuY29tcG9uZW50cy5jb2xsaXNpb24ub25Db2xsaXNpb24oZW50aXR5Qik7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlbnRpdHlCLmNvbXBvbmVudHMuY29sbGlzaW9uLm9uQ29sbGlzaW9uKSB7XG5cdFx0XHRcdGVudGl0eUIuY29tcG9uZW50cy5jb2xsaXNpb24ub25Db2xsaXNpb24oZW50aXR5QSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG5leHBvcnRzLkNvbGxpc2lvblN5c3RlbSA9IENvbGxpc2lvblN5c3RlbTtcbiIsInZhciBHcmFwaGljc1N5c3RlbSA9IGZ1bmN0aW9uKGVudGl0aWVzKSB7XG5cdHRoaXMuZW50aXRpZXMgPSBlbnRpdGllcztcblx0Ly8gQ2FudmFzIGlzIHdoZXJlIHdlIGRyYXdcblx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1jYW52YXMnKTtcblx0Ly8gQ2FudmFzIGlzIHdoYXQgd2UgZHJhdyB0b1xuXHR0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xufTtcblxuR3JhcGhpY3NTeXN0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuXHQvLyBSdW4gdGhlIHJlbmRlciBsb29wXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xufTtcblxuR3JhcGhpY3NTeXN0ZW0ucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbigpIHtcblx0Ly8gU2V0IHRoZSBjYW52YXMgdG8gdGhlIGNvcnJlY3Qgc2l6ZSBpZiB0aGUgd2luZG93IGlzIHJlc2l6ZWRcblx0aWYgKHRoaXMuY2FudmFzLndpZHRoICE9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoIHx8XG5cdFx0dGhpcy5jYW52YXMuaGVpZ2h0ICE9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodCkge1xuXHRcdFx0dGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy5vZmZzZXRXaWR0aDtcblx0XHRcdHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodDtcblx0XHR9XG5cblx0Ly8gQ2xlYXIgdGhlIGNhbnZhc1xuXHR0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXG5cdHRoaXMuY29udGV4dC5zYXZlKCk7XG5cdHRoaXMuY29udGV4dC50cmFuc2xhdGUodGhpcy5jYW52YXMud2lkdGggLyAyLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHR0aGlzLmNvbnRleHQuc2NhbGUodGhpcy5jYW52YXMuaGVpZ2h0LCAtdGhpcy5jYW52YXMuaGVpZ2h0KTtcdC8vZmxpcHMgdGhlIHkgY29vcmRcblxuXHQvLyBSZW5kZXJpbmcgZ29lcyBoZXJlXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBlbnRpdHkgPSB0aGlzLmVudGl0aWVzW2ldO1xuXHRcdGlmICghKCdncmFwaGljcycgaW4gZW50aXR5LmNvbXBvbmVudHMpKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0ZW50aXR5LmNvbXBvbmVudHMuZ3JhcGhpY3MuZHJhdyh0aGlzLmNvbnRleHQpO1xuXHR9XG5cblx0dGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcblxuXHQvLyBDb250aW51ZSB0aGUgcmVuZGVyIGxvb3Bcblx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XG59O1xuXG5leHBvcnRzLkdyYXBoaWNzU3lzdGVtID0gR3JhcGhpY3NTeXN0ZW07XG4iLCJ2YXIgSW5wdXRTeXN0ZW0gPSBmdW5jdGlvbihlbnRpdGllcykge1xuXHR0aGlzLmVudGl0aWVzID0gZW50aXRpZXM7XG5cblx0Ly8gQ2FudmFzIGlzIHdoZXJlIHdlIGdldCBpbnB1dCBmcm9tXG5cdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY2FudmFzJyk7XG59O1xuXG5JbnB1dFN5c3RlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsaWNrLmJpbmQodGhpcykpO1xufTtcblxuSW5wdXRTeXN0ZW0ucHJvdG90eXBlLm9uQ2xpY2sgPSBmdW5jdGlvbigpIHtcblx0dmFyIGJpcmQgPSB0aGlzLmVudGl0aWVzWzBdO1xuXHRiaXJkLmNvbXBvbmVudHMucGh5c2ljcy52ZWxvY2l0eS55ID0gMC42O1xufTtcblxuZXhwb3J0cy5JbnB1dFN5c3RlbSA9IElucHV0U3lzdGVtO1xuIiwidmFyIGNvbGxpc2lvblN5c3RlbSA9IHJlcXVpcmUoXCIuL2NvbGxpc2lvblwiKTtcblxudmFyIFBoeXNpY3NTeXN0ZW0gPSBmdW5jdGlvbihlbnRpdGllcykge1xuXHR0aGlzLmVudGl0aWVzID0gZW50aXRpZXM7XG5cdHRoaXMuY29sbGlzaW9uU3lzdGVtID0gbmV3IGNvbGxpc2lvblN5c3RlbS5Db2xsaXNpb25TeXN0ZW0oZW50aXRpZXMpO1xufTtcblxuUGh5c2ljc1N5c3RlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cdC8vIFJ1biB0aGUgdXBkYXRlIGxvb3Bcblx0d2luZG93LnNldEludGVydmFsKHRoaXMudGljay5iaW5kKHRoaXMpLCAxMDAwIC8gNjApO1xufTtcblxuUGh5c2ljc1N5c3RlbS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZW50aXR5ID0gdGhpcy5lbnRpdGllc1tpXTtcblx0XHRpZiAoISgncGh5c2ljcycgaW4gZW50aXR5LmNvbXBvbmVudHMpKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0ZW50aXR5LmNvbXBvbmVudHMucGh5c2ljcy51cGRhdGUoMS82MCk7XG5cdH1cblx0dGhpcy5jb2xsaXNpb25TeXN0ZW0udGljaygpO1xufTtcblxuZXhwb3J0cy5QaHlzaWNzU3lzdGVtID0gUGh5c2ljc1N5c3RlbTtcbiIsInZhciBwaXBlID0gcmVxdWlyZSgnLi4vZW50aXRpZXMvcGlwZScpO1xuXG52YXIgUGlwZXNTeXN0ZW0gPSBmdW5jdGlvbihlbnRpdGllcykge1xuXHR0aGlzLmVudGl0aWVzID0gZW50aXRpZXM7XG59O1xuXG5QaXBlc1N5c3RlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cdC8vIFJ1biB0aGUgdXBkYXRlIGxvb3Bcblx0d2luZG93LnNldEludGVydmFsKHRoaXMudGljay5iaW5kKHRoaXMpLCAyMDAwKTtcbn07XG5cblBpcGVzU3lzdGVtLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKCdJbiBQaXBlc1N5c3RlbScpO1xuXHR2YXIgcGlwZUJvdHRvbSA9IG5ldyBwaXBlLlBpcGUoeyB4OiAxLCB5OiAwIH0pO1xuXHR2YXIgcGlwZVRvcCA9IG5ldyBwaXBlLlBpcGUoeyB4OiAxLCB5OiAwLjYgfSk7XG5cdHRoaXMuZW50aXRpZXMucHVzaChwaXBlQm90dG9tLCBwaXBlVG9wKTtcbn07XG5cbmV4cG9ydHMuUGlwZXNTeXN0ZW0gPSBQaXBlc1N5c3RlbTtcbiJdfQ==
