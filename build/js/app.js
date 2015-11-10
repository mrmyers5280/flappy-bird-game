(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
var graphicsComponent = require("../components/graphics/bird");
var physicsComponent = require("../components/physics/physics");

var Bird = function() {
	// console.log("Creating Bird Entity");
	var physics = new physicsComponent.PhysicsComponent(this);
	physics.position.y = 0.5;
	physics.acceleration.y = -2;	// How strong gravity is

	var graphics = new graphicsComponent.BirdGraphicsComponent(this);

	this.components = {
		physics: physics,
		graphics: graphics
	};
};

exports.Bird = Bird;

},{"../components/graphics/bird":1,"../components/physics/physics":3}],5:[function(require,module,exports){
var graphicsComponent = require("../components/graphics/pipe");
var physicsComponent = require("../components/physics/physics");

var Pipe = function(position) {
	// console.log("Creating Pipe entity");
	var physics = new physicsComponent.PhysicsComponent(this);
	physics.position.x = position.x;
	physics.position.y = position.y;
	physics.velocity.x = -0.1;	// move the pipes towards the bird

	var graphics = new graphicsComponent.PipeGraphicsComponent(this);

	this.components = {
		physics: physics,
		graphics: graphics
	};
};

exports.Pipe = Pipe;

},{"../components/graphics/pipe":2,"../components/physics/physics":3}],6:[function(require,module,exports){
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

},{"./entities/bird":4,"./entities/pipe":5,"./systems/graphics":9,"./systems/input":10,"./systems/physics":11,"./systems/pipes":12}],7:[function(require,module,exports){
var flappyBird = require('./flappy_bird');

document.addEventListener('DOMContentLoaded', function() {
	var app = new flappyBird.FlappyBird();
	app.run();
});

},{"./flappy_bird":6}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
	for (var i = 0; i < this. entities.length; i++) {
		var entity = this.entities[i];
		if (!('physics' in entity.components)) {
			continue;
		}
		entity.components.physics.update(1/60);
	}
	this.collisionSystem.tick();
};

exports.PhysicsSystem = PhysicsSystem;

},{"./collision":8}],12:[function(require,module,exports){
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

},{"../entities/pipe":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jb21wb25lbnRzL2dyYXBoaWNzL2JpcmQuanMiLCJqcy9jb21wb25lbnRzL2dyYXBoaWNzL3BpcGUuanMiLCJqcy9jb21wb25lbnRzL3BoeXNpY3MvcGh5c2ljcy5qcyIsImpzL2VudGl0aWVzL2JpcmQuanMiLCJqcy9lbnRpdGllcy9waXBlLmpzIiwianMvZmxhcHB5X2JpcmQuanMiLCJqcy9tYWluLmpzIiwianMvc3lzdGVtcy9jb2xsaXNpb24uanMiLCJqcy9zeXN0ZW1zL2dyYXBoaWNzLmpzIiwianMvc3lzdGVtcy9pbnB1dC5qcyIsImpzL3N5c3RlbXMvcGh5c2ljcy5qcyIsImpzL3N5c3RlbXMvcGlwZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEJpcmRHcmFwaGljc0NvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHR0aGlzLmVudGl0eSA9IGVudGl0eTtcbn07XG5cbkJpcmRHcmFwaGljc0NvbXBvbmVudC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcblx0dmFyIHBvc2l0aW9uID0gdGhpcy5lbnRpdHkuY29tcG9uZW50cy5waHlzaWNzLnBvc2l0aW9uO1xuXG5cdGNvbnRleHQuc2F2ZSgpO1xuXHRjb250ZXh0LnRyYW5zbGF0ZShwb3NpdGlvbi54LCBwb3NpdGlvbi55KTtcblx0Y29udGV4dC5iZWdpblBhdGgoKTtcblx0Y29udGV4dC5hcmMoMCwgMCwgMC4wMiwgMCwgMiAqIE1hdGguUEkpO1xuXHRjb250ZXh0LmZpbGwoKTtcblx0Y29udGV4dC5jbG9zZVBhdGgoKTtcblx0Y29udGV4dC5yZXN0b3JlKCk7XG59O1xuXG5leHBvcnRzLkJpcmRHcmFwaGljc0NvbXBvbmVudCA9IEJpcmRHcmFwaGljc0NvbXBvbmVudDtcbiIsInZhciBQaXBlR3JhcGhpY3NDb21wb25lbnQgPSBmdW5jdGlvbihlbnRpdHkpIHtcblx0dGhpcy5lbnRpdHkgPSBlbnRpdHk7XG59O1xuXG5QaXBlR3JhcGhpY3NDb21wb25lbnQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjb250ZXh0KSB7XG5cdHZhciBwb3NpdGlvbiA9IHRoaXMuZW50aXR5LmNvbXBvbmVudHMucGh5c2ljcy5wb3NpdGlvbjtcblx0Ly8gdmFyIHBvc2l0aW9uID0geyB4OiAxLCB5OiAwIH07XG5cblx0Y29udGV4dC5zYXZlKCk7XG5cdGNvbnRleHQudHJhbnNsYXRlKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRjb250ZXh0LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcblx0Y29udGV4dC5maWxsUmVjdCgwLCAwLCAwLjEsIDAuNCk7XG5cdGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cdGNvbnRleHQucmVzdG9yZSgpO1xufTtcblxuZXhwb3J0cy5QaXBlR3JhcGhpY3NDb21wb25lbnQgPSBQaXBlR3JhcGhpY3NDb21wb25lbnQ7XG4iLCJ2YXIgUGh5c2ljc0NvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHR0aGlzLmVudGl0eSA9IGVudGl0eTtcblxuXHR0aGlzLnBvc2l0aW9uID0ge1xuXHRcdHg6IDAsXG5cdFx0eTogMFxuXHR9O1xuXHR0aGlzLnZlbG9jaXR5ID0ge1xuXHRcdHg6IDAsXG5cdFx0eTogMFxuXHR9O1xuXHR0aGlzLmFjY2VsZXJhdGlvbiA9IHtcblx0XHR4OiAwLFxuXHRcdHk6IDBcblx0fTtcbn07XG5cblBoeXNpY3NDb21wb25lbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRlbHRhKSB7XG5cdHRoaXMudmVsb2NpdHkueCArPSB0aGlzLmFjY2VsZXJhdGlvbi54ICogZGVsdGE7XG5cdHRoaXMudmVsb2NpdHkueSArPSB0aGlzLmFjY2VsZXJhdGlvbi55ICogZGVsdGE7XG5cblx0dGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueCAqIGRlbHRhO1xuXHR0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogZGVsdGE7XG59O1xuXG5leHBvcnRzLlBoeXNpY3NDb21wb25lbnQgPSBQaHlzaWNzQ29tcG9uZW50O1xuIiwidmFyIGdyYXBoaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvZ3JhcGhpY3MvYmlyZFwiKTtcbnZhciBwaHlzaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvcGh5c2ljcy9waHlzaWNzXCIpO1xuXG52YXIgQmlyZCA9IGZ1bmN0aW9uKCkge1xuXHQvLyBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIEJpcmQgRW50aXR5XCIpO1xuXHR2YXIgcGh5c2ljcyA9IG5ldyBwaHlzaWNzQ29tcG9uZW50LlBoeXNpY3NDb21wb25lbnQodGhpcyk7XG5cdHBoeXNpY3MucG9zaXRpb24ueSA9IDAuNTtcblx0cGh5c2ljcy5hY2NlbGVyYXRpb24ueSA9IC0yO1x0Ly8gSG93IHN0cm9uZyBncmF2aXR5IGlzXG5cblx0dmFyIGdyYXBoaWNzID0gbmV3IGdyYXBoaWNzQ29tcG9uZW50LkJpcmRHcmFwaGljc0NvbXBvbmVudCh0aGlzKTtcblxuXHR0aGlzLmNvbXBvbmVudHMgPSB7XG5cdFx0cGh5c2ljczogcGh5c2ljcyxcblx0XHRncmFwaGljczogZ3JhcGhpY3Ncblx0fTtcbn07XG5cbmV4cG9ydHMuQmlyZCA9IEJpcmQ7XG4iLCJ2YXIgZ3JhcGhpY3NDb21wb25lbnQgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9ncmFwaGljcy9waXBlXCIpO1xudmFyIHBoeXNpY3NDb21wb25lbnQgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9waHlzaWNzL3BoeXNpY3NcIik7XG5cbnZhciBQaXBlID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcblx0Ly8gY29uc29sZS5sb2coXCJDcmVhdGluZyBQaXBlIGVudGl0eVwiKTtcblx0dmFyIHBoeXNpY3MgPSBuZXcgcGh5c2ljc0NvbXBvbmVudC5QaHlzaWNzQ29tcG9uZW50KHRoaXMpO1xuXHRwaHlzaWNzLnBvc2l0aW9uLnggPSBwb3NpdGlvbi54O1xuXHRwaHlzaWNzLnBvc2l0aW9uLnkgPSBwb3NpdGlvbi55O1xuXHRwaHlzaWNzLnZlbG9jaXR5LnggPSAtMC4xO1x0Ly8gbW92ZSB0aGUgcGlwZXMgdG93YXJkcyB0aGUgYmlyZFxuXG5cdHZhciBncmFwaGljcyA9IG5ldyBncmFwaGljc0NvbXBvbmVudC5QaXBlR3JhcGhpY3NDb21wb25lbnQodGhpcyk7XG5cblx0dGhpcy5jb21wb25lbnRzID0ge1xuXHRcdHBoeXNpY3M6IHBoeXNpY3MsXG5cdFx0Z3JhcGhpY3M6IGdyYXBoaWNzXG5cdH07XG59O1xuXG5leHBvcnRzLlBpcGUgPSBQaXBlO1xuIiwidmFyIGdyYXBoaWNzU3lzdGVtID0gcmVxdWlyZSgnLi9zeXN0ZW1zL2dyYXBoaWNzJyk7XG52YXIgcGh5c2ljc1N5c3RlbSA9IHJlcXVpcmUoJy4vc3lzdGVtcy9waHlzaWNzJyk7XG52YXIgaW5wdXRTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbXMvaW5wdXQnKTtcbnZhciBwaXBlc1N5c3RlbSA9IHJlcXVpcmUoJy4vc3lzdGVtcy9waXBlcycpO1xudmFyIGJpcmQgPSByZXF1aXJlKCcuL2VudGl0aWVzL2JpcmQnKTtcbnZhciBwaXBlID0gcmVxdWlyZSgnLi9lbnRpdGllcy9waXBlJyk7XG5cbnZhciBGbGFwcHlCaXJkID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuZW50aXRpZXMgPSBbbmV3IGJpcmQuQmlyZCgpLCBuZXcgcGlwZS5QaXBlKHsgeDogMSwgeTogMCB9KSwgbmV3IHBpcGUuUGlwZSh7IHg6IDEsIHk6IDAuNiB9KV07XG5cdHRoaXMuZ3JhcGhpY3MgPSBuZXcgZ3JhcGhpY3NTeXN0ZW0uR3JhcGhpY3NTeXN0ZW0odGhpcy5lbnRpdGllcyk7XG5cdHRoaXMucGh5c2ljcyA9IG5ldyBwaHlzaWNzU3lzdGVtLlBoeXNpY3NTeXN0ZW0odGhpcy5lbnRpdGllcyk7XG5cdHRoaXMuaW5wdXQgPSBuZXcgaW5wdXRTeXN0ZW0uSW5wdXRTeXN0ZW0odGhpcy5lbnRpdGllcyk7XG5cdHRoaXMucGlwZXMgPSBuZXcgcGlwZXNTeXN0ZW0uUGlwZXNTeXN0ZW0odGhpcy5lbnRpdGllcyk7XG59O1xuXG5GbGFwcHlCaXJkLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbigpIHtcblx0dGhpcy5ncmFwaGljcy5ydW4oKTtcblx0dGhpcy5waHlzaWNzLnJ1bigpO1xuXHR0aGlzLmlucHV0LnJ1bigpO1xuXHR0aGlzLnBpcGVzLnJ1bigpO1xufTtcblxuZXhwb3J0cy5GbGFwcHlCaXJkID0gRmxhcHB5QmlyZDtcbiIsInZhciBmbGFwcHlCaXJkID0gcmVxdWlyZSgnLi9mbGFwcHlfYmlyZCcpO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG5cdHZhciBhcHAgPSBuZXcgZmxhcHB5QmlyZC5GbGFwcHlCaXJkKCk7XG5cdGFwcC5ydW4oKTtcbn0pO1xuIiwidmFyIENvbGxpc2lvblN5c3RlbSA9IGZ1bmN0aW9uKGVudGl0aWVzKSB7XG5cdHRoaXMuZW50aXRpZXMgPSBlbnRpdGllcztcbn07XG5cbkNvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZW50aXR5QSA9IHRoaXMuZW50aXRpZXNbaV07XG5cdFx0aWYgKCEoJ2NvbGxpc2lvbicgaW4gZW50aXR5QS5jb21wb25lbnRzKSkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaiA9IGkrMTsgaiA8IHRoaXMuZW50aXRpZXMubGVuZ3RoOyBqKyspIHtcblx0XHRcdHZhciBlbnRpdHlCID0gdGhpcy5lbnRpdGllc1tqXTtcblx0XHRcdGlmICghKCdjb2xsaXNpb24nIGluIGVudGl0eUIuY29tcG9uZW50cykpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghKGVudGl0eUEuY29tcG9uZW50cy5jb2xsaXNpb24uY29sbGlkZXNXaXRoKGVudGl0eUIpKSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGVudGl0eUEuY29tcG9uZW50cy5jb2xsaXNpb24ub25Db2xsaXNpb24pIHtcblx0XHRcdFx0ZW50aXR5QS5jb21wb25lbnRzLmNvbGxpc2lvbi5vbkNvbGxpc2lvbihlbnRpdHlCKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGVudGl0eUIuY29tcG9uZW50cy5jb2xsaXNpb24ub25Db2xsaXNpb24pIHtcblx0XHRcdFx0ZW50aXR5Qi5jb21wb25lbnRzLmNvbGxpc2lvbi5vbkNvbGxpc2lvbihlbnRpdHlBKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG5cbmV4cG9ydHMuQ29sbGlzaW9uU3lzdGVtID0gQ29sbGlzaW9uU3lzdGVtO1xuIiwidmFyIEdyYXBoaWNzU3lzdGVtID0gZnVuY3Rpb24oZW50aXRpZXMpIHtcblx0dGhpcy5lbnRpdGllcyA9IGVudGl0aWVzO1xuXHQvLyBDYW52YXMgaXMgd2hlcmUgd2UgZHJhd1xuXHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNhbnZhcycpO1xuXHQvLyBDYW52YXMgaXMgd2hhdCB3ZSBkcmF3IHRvXG5cdHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG59O1xuXG5HcmFwaGljc1N5c3RlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cdC8vIFJ1biB0aGUgcmVuZGVyIGxvb3Bcblx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XG59O1xuXG5HcmFwaGljc1N5c3RlbS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuXHQvLyBTZXQgdGhlIGNhbnZhcyB0byB0aGUgY29ycmVjdCBzaXplIGlmIHRoZSB3aW5kb3cgaXMgcmVzaXplZFxuXHRpZiAodGhpcy5jYW52YXMud2lkdGggIT0gdGhpcy5jYW52YXMub2Zmc2V0V2lkdGggfHxcblx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgIT0gdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0KSB7XG5cdFx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoO1xuXHRcdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0O1xuXHRcdH1cblxuXHQvLyBDbGVhciB0aGUgY2FudmFzXG5cdHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG5cblx0dGhpcy5jb250ZXh0LnNhdmUoKTtcblx0dGhpcy5jb250ZXh0LnRyYW5zbGF0ZSh0aGlzLmNhbnZhcy53aWR0aCAvIDIsIHRoaXMuY2FudmFzLmhlaWdodCk7XG5cdHRoaXMuY29udGV4dC5zY2FsZSh0aGlzLmNhbnZhcy5oZWlnaHQsIC10aGlzLmNhbnZhcy5oZWlnaHQpO1x0Ly9mbGlwcyB0aGUgeSBjb29yZFxuXG5cdC8vIFJlbmRlcmluZyBnb2VzIGhlcmVcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGVudGl0eSA9IHRoaXMuZW50aXRpZXNbaV07XG5cdFx0aWYgKCEoJ2dyYXBoaWNzJyBpbiBlbnRpdHkuY29tcG9uZW50cykpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRlbnRpdHkuY29tcG9uZW50cy5ncmFwaGljcy5kcmF3KHRoaXMuY29udGV4dCk7XG5cdH1cblxuXHR0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG5cdC8vIENvbnRpbnVlIHRoZSByZW5kZXIgbG9vcFxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcbn07XG5cbmV4cG9ydHMuR3JhcGhpY3NTeXN0ZW0gPSBHcmFwaGljc1N5c3RlbTtcbiIsInZhciBJbnB1dFN5c3RlbSA9IGZ1bmN0aW9uKGVudGl0aWVzKSB7XG5cdHRoaXMuZW50aXRpZXMgPSBlbnRpdGllcztcblxuXHQvLyBDYW52YXMgaXMgd2hlcmUgd2UgZ2V0IGlucHV0IGZyb21cblx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1jYW52YXMnKTtcbn07XG5cbklucHV0U3lzdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2suYmluZCh0aGlzKSk7XG59O1xuXG5JbnB1dFN5c3RlbS5wcm90b3R5cGUub25DbGljayA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgYmlyZCA9IHRoaXMuZW50aXRpZXNbMF07XG5cdGJpcmQuY29tcG9uZW50cy5waHlzaWNzLnZlbG9jaXR5LnkgPSAwLjY7XG59O1xuXG5leHBvcnRzLklucHV0U3lzdGVtID0gSW5wdXRTeXN0ZW07XG4iLCJ2YXIgY29sbGlzaW9uU3lzdGVtID0gcmVxdWlyZShcIi4vY29sbGlzaW9uXCIpO1xuXG52YXIgUGh5c2ljc1N5c3RlbSA9IGZ1bmN0aW9uKGVudGl0aWVzKSB7XG5cdHRoaXMuZW50aXRpZXMgPSBlbnRpdGllcztcblx0dGhpcy5jb2xsaXNpb25TeXN0ZW0gPSBuZXcgY29sbGlzaW9uU3lzdGVtLkNvbGxpc2lvblN5c3RlbShlbnRpdGllcyk7XG59O1xuXG5QaHlzaWNzU3lzdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbigpIHtcblx0Ly8gUnVuIHRoZSB1cGRhdGUgbG9vcFxuXHR3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy50aWNrLmJpbmQodGhpcyksIDEwMDAgLyA2MCk7XG59O1xuXG5QaHlzaWNzU3lzdGVtLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy4gZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZW50aXR5ID0gdGhpcy5lbnRpdGllc1tpXTtcblx0XHRpZiAoISgncGh5c2ljcycgaW4gZW50aXR5LmNvbXBvbmVudHMpKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0ZW50aXR5LmNvbXBvbmVudHMucGh5c2ljcy51cGRhdGUoMS82MCk7XG5cdH1cblx0dGhpcy5jb2xsaXNpb25TeXN0ZW0udGljaygpO1xufTtcblxuZXhwb3J0cy5QaHlzaWNzU3lzdGVtID0gUGh5c2ljc1N5c3RlbTtcbiIsInZhciBwaXBlID0gcmVxdWlyZSgnLi4vZW50aXRpZXMvcGlwZScpO1xuXG52YXIgUGlwZXNTeXN0ZW0gPSBmdW5jdGlvbihlbnRpdGllcykge1xuXHR0aGlzLmVudGl0aWVzID0gZW50aXRpZXM7XG59O1xuXG5QaXBlc1N5c3RlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cdC8vIFJ1biB0aGUgdXBkYXRlIGxvb3Bcblx0d2luZG93LnNldEludGVydmFsKHRoaXMudGljay5iaW5kKHRoaXMpLCAyMDAwKTtcbn07XG5cblBpcGVzU3lzdGVtLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKCdJbiBQaXBlc1N5c3RlbScpO1xuXHR2YXIgcGlwZUJvdHRvbSA9IG5ldyBwaXBlLlBpcGUoeyB4OiAxLCB5OiAwIH0pO1xuXHR2YXIgcGlwZVRvcCA9IG5ldyBwaXBlLlBpcGUoeyB4OiAxLCB5OiAwLjYgfSk7XG5cdHRoaXMuZW50aXRpZXMucHVzaChwaXBlQm90dG9tLCBwaXBlVG9wKTtcbn07XG5cbmV4cG9ydHMuUGlwZXNTeXN0ZW0gPSBQaXBlc1N5c3RlbTtcbiJdfQ==
