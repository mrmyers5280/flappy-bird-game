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

	// top/hanging pipe
	// position = { x: 1, y: 0.4 };
	//
	// context.save();
	// context.translate(position.x, position.y);
	// context.beginPath();
	// context.fillStyle = "green";
	// context.fillRect(0, 0, 0.1, 0.6);
	// context.closePath();
	// context.restore();
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

},{"./entities/bird":4,"./entities/pipe":5,"./systems/graphics":8,"./systems/input":9,"./systems/physics":10,"./systems/pipes":11}],7:[function(require,module,exports){
var flappyBird = require('./flappy_bird');

document.addEventListener('DOMContentLoaded', function() {
	var app = new flappyBird.FlappyBird();
	app.run();
});

},{"./flappy_bird":6}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
var PhysicsSystem = function(entities) {
	this.entities = entities;
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
};

exports.PhysicsSystem = PhysicsSystem;

},{}],11:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jb21wb25lbnRzL2dyYXBoaWNzL2JpcmQuanMiLCJqcy9jb21wb25lbnRzL2dyYXBoaWNzL3BpcGUuanMiLCJqcy9jb21wb25lbnRzL3BoeXNpY3MvcGh5c2ljcy5qcyIsImpzL2VudGl0aWVzL2JpcmQuanMiLCJqcy9lbnRpdGllcy9waXBlLmpzIiwianMvZmxhcHB5X2JpcmQuanMiLCJqcy9tYWluLmpzIiwianMvc3lzdGVtcy9ncmFwaGljcy5qcyIsImpzL3N5c3RlbXMvaW5wdXQuanMiLCJqcy9zeXN0ZW1zL3BoeXNpY3MuanMiLCJqcy9zeXN0ZW1zL3BpcGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQmlyZEdyYXBoaWNzQ29tcG9uZW50ID0gZnVuY3Rpb24oZW50aXR5KSB7XG5cdHRoaXMuZW50aXR5ID0gZW50aXR5O1xufTtcblxuQmlyZEdyYXBoaWNzQ29tcG9uZW50LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY29udGV4dCkge1xuXHR2YXIgcG9zaXRpb24gPSB0aGlzLmVudGl0eS5jb21wb25lbnRzLnBoeXNpY3MucG9zaXRpb247XG5cblx0Y29udGV4dC5zYXZlKCk7XG5cdGNvbnRleHQudHJhbnNsYXRlKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRjb250ZXh0LmFyYygwLCAwLCAwLjAyLCAwLCAyICogTWF0aC5QSSk7XG5cdGNvbnRleHQuZmlsbCgpO1xuXHRjb250ZXh0LmNsb3NlUGF0aCgpO1xuXHRjb250ZXh0LnJlc3RvcmUoKTtcbn07XG5cbmV4cG9ydHMuQmlyZEdyYXBoaWNzQ29tcG9uZW50ID0gQmlyZEdyYXBoaWNzQ29tcG9uZW50O1xuIiwidmFyIFBpcGVHcmFwaGljc0NvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHR0aGlzLmVudGl0eSA9IGVudGl0eTtcbn07XG5cblBpcGVHcmFwaGljc0NvbXBvbmVudC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcblx0dmFyIHBvc2l0aW9uID0gdGhpcy5lbnRpdHkuY29tcG9uZW50cy5waHlzaWNzLnBvc2l0aW9uO1xuXHQvLyB2YXIgcG9zaXRpb24gPSB7IHg6IDEsIHk6IDAgfTtcblxuXHRjb250ZXh0LnNhdmUoKTtcblx0Y29udGV4dC50cmFuc2xhdGUocG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG5cdGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdGNvbnRleHQuZmlsbFN0eWxlID0gXCJncmVlblwiO1xuXHRjb250ZXh0LmZpbGxSZWN0KDAsIDAsIDAuMSwgMC40KTtcblx0Y29udGV4dC5jbG9zZVBhdGgoKTtcblx0Y29udGV4dC5yZXN0b3JlKCk7XG5cblx0Ly8gdG9wL2hhbmdpbmcgcGlwZVxuXHQvLyBwb3NpdGlvbiA9IHsgeDogMSwgeTogMC40IH07XG5cdC8vXG5cdC8vIGNvbnRleHQuc2F2ZSgpO1xuXHQvLyBjb250ZXh0LnRyYW5zbGF0ZShwb3NpdGlvbi54LCBwb3NpdGlvbi55KTtcblx0Ly8gY29udGV4dC5iZWdpblBhdGgoKTtcblx0Ly8gY29udGV4dC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XG5cdC8vIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgMC4xLCAwLjYpO1xuXHQvLyBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXHQvLyBjb250ZXh0LnJlc3RvcmUoKTtcbn07XG5cbmV4cG9ydHMuUGlwZUdyYXBoaWNzQ29tcG9uZW50ID0gUGlwZUdyYXBoaWNzQ29tcG9uZW50O1xuIiwidmFyIFBoeXNpY3NDb21wb25lbnQgPSBmdW5jdGlvbihlbnRpdHkpIHtcblx0dGhpcy5lbnRpdHkgPSBlbnRpdHk7XG5cblx0dGhpcy5wb3NpdGlvbiA9IHtcblx0XHR4OiAwLFxuXHRcdHk6IDBcblx0fTtcblx0dGhpcy52ZWxvY2l0eSA9IHtcblx0XHR4OiAwLFxuXHRcdHk6IDBcblx0fTtcblx0dGhpcy5hY2NlbGVyYXRpb24gPSB7XG5cdFx0eDogMCxcblx0XHR5OiAwXG5cdH07XG59O1xuXG5QaHlzaWNzQ29tcG9uZW50LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YSkge1xuXHR0aGlzLnZlbG9jaXR5LnggKz0gdGhpcy5hY2NlbGVyYXRpb24ueCAqIGRlbHRhO1xuXHR0aGlzLnZlbG9jaXR5LnkgKz0gdGhpcy5hY2NlbGVyYXRpb24ueSAqIGRlbHRhO1xuXG5cdHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5LnggKiBkZWx0YTtcblx0dGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueSAqIGRlbHRhO1xufTtcblxuZXhwb3J0cy5QaHlzaWNzQ29tcG9uZW50ID0gUGh5c2ljc0NvbXBvbmVudDtcbiIsInZhciBncmFwaGljc0NvbXBvbmVudCA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2dyYXBoaWNzL2JpcmRcIik7XG52YXIgcGh5c2ljc0NvbXBvbmVudCA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3BoeXNpY3MvcGh5c2ljc1wiKTtcblxudmFyIEJpcmQgPSBmdW5jdGlvbigpIHtcblx0Ly8gY29uc29sZS5sb2coXCJDcmVhdGluZyBCaXJkIEVudGl0eVwiKTtcblx0dmFyIHBoeXNpY3MgPSBuZXcgcGh5c2ljc0NvbXBvbmVudC5QaHlzaWNzQ29tcG9uZW50KHRoaXMpO1xuXHRwaHlzaWNzLnBvc2l0aW9uLnkgPSAwLjU7XG5cdHBoeXNpY3MuYWNjZWxlcmF0aW9uLnkgPSAtMjtcdC8vIEhvdyBzdHJvbmcgZ3Jhdml0eSBpc1xuXG5cdHZhciBncmFwaGljcyA9IG5ldyBncmFwaGljc0NvbXBvbmVudC5CaXJkR3JhcGhpY3NDb21wb25lbnQodGhpcyk7XG5cblx0dGhpcy5jb21wb25lbnRzID0ge1xuXHRcdHBoeXNpY3M6IHBoeXNpY3MsXG5cdFx0Z3JhcGhpY3M6IGdyYXBoaWNzXG5cdH07XG59O1xuXG5leHBvcnRzLkJpcmQgPSBCaXJkO1xuIiwidmFyIGdyYXBoaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvZ3JhcGhpY3MvcGlwZVwiKTtcbnZhciBwaHlzaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvcGh5c2ljcy9waHlzaWNzXCIpO1xuXG52YXIgUGlwZSA9IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG5cdC8vIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgUGlwZSBlbnRpdHlcIik7XG5cdHZhciBwaHlzaWNzID0gbmV3IHBoeXNpY3NDb21wb25lbnQuUGh5c2ljc0NvbXBvbmVudCh0aGlzKTtcblx0cGh5c2ljcy5wb3NpdGlvbi54ID0gcG9zaXRpb24ueDtcblx0cGh5c2ljcy5wb3NpdGlvbi55ID0gcG9zaXRpb24ueTtcblx0cGh5c2ljcy52ZWxvY2l0eS54ID0gLTAuMTtcdC8vIG1vdmUgdGhlIHBpcGVzIHRvd2FyZHMgdGhlIGJpcmRcblxuXHR2YXIgZ3JhcGhpY3MgPSBuZXcgZ3JhcGhpY3NDb21wb25lbnQuUGlwZUdyYXBoaWNzQ29tcG9uZW50KHRoaXMpO1xuXG5cdHRoaXMuY29tcG9uZW50cyA9IHtcblx0XHRwaHlzaWNzOiBwaHlzaWNzLFxuXHRcdGdyYXBoaWNzOiBncmFwaGljc1xuXHR9O1xufTtcblxuZXhwb3J0cy5QaXBlID0gUGlwZTtcbiIsInZhciBncmFwaGljc1N5c3RlbSA9IHJlcXVpcmUoJy4vc3lzdGVtcy9ncmFwaGljcycpO1xudmFyIHBoeXNpY3NTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbXMvcGh5c2ljcycpO1xudmFyIGlucHV0U3lzdGVtID0gcmVxdWlyZSgnLi9zeXN0ZW1zL2lucHV0Jyk7XG52YXIgcGlwZXNTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbXMvcGlwZXMnKTtcbnZhciBiaXJkID0gcmVxdWlyZSgnLi9lbnRpdGllcy9iaXJkJyk7XG52YXIgcGlwZSA9IHJlcXVpcmUoJy4vZW50aXRpZXMvcGlwZScpO1xuXG52YXIgRmxhcHB5QmlyZCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmVudGl0aWVzID0gW25ldyBiaXJkLkJpcmQoKSwgbmV3IHBpcGUuUGlwZSh7IHg6IDEsIHk6IDAgfSksIG5ldyBwaXBlLlBpcGUoeyB4OiAxLCB5OiAwLjYgfSldO1xuXHR0aGlzLmdyYXBoaWNzID0gbmV3IGdyYXBoaWNzU3lzdGVtLkdyYXBoaWNzU3lzdGVtKHRoaXMuZW50aXRpZXMpO1xuXHR0aGlzLnBoeXNpY3MgPSBuZXcgcGh5c2ljc1N5c3RlbS5QaHlzaWNzU3lzdGVtKHRoaXMuZW50aXRpZXMpO1xuXHR0aGlzLmlucHV0ID0gbmV3IGlucHV0U3lzdGVtLklucHV0U3lzdGVtKHRoaXMuZW50aXRpZXMpO1xuXHR0aGlzLnBpcGVzID0gbmV3IHBpcGVzU3lzdGVtLlBpcGVzU3lzdGVtKHRoaXMuZW50aXRpZXMpO1xufTtcblxuRmxhcHB5QmlyZC5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuZ3JhcGhpY3MucnVuKCk7XG5cdHRoaXMucGh5c2ljcy5ydW4oKTtcblx0dGhpcy5pbnB1dC5ydW4oKTtcblx0dGhpcy5waXBlcy5ydW4oKTtcbn07XG5cbmV4cG9ydHMuRmxhcHB5QmlyZCA9IEZsYXBweUJpcmQ7XG4iLCJ2YXIgZmxhcHB5QmlyZCA9IHJlcXVpcmUoJy4vZmxhcHB5X2JpcmQnKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuXHR2YXIgYXBwID0gbmV3IGZsYXBweUJpcmQuRmxhcHB5QmlyZCgpO1xuXHRhcHAucnVuKCk7XG59KTtcbiIsInZhciBHcmFwaGljc1N5c3RlbSA9IGZ1bmN0aW9uKGVudGl0aWVzKSB7XG5cdHRoaXMuZW50aXRpZXMgPSBlbnRpdGllcztcblx0Ly8gQ2FudmFzIGlzIHdoZXJlIHdlIGRyYXdcblx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1jYW52YXMnKTtcblx0Ly8gQ2FudmFzIGlzIHdoYXQgd2UgZHJhdyB0b1xuXHR0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xufTtcblxuR3JhcGhpY3NTeXN0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuXHQvLyBSdW4gdGhlIHJlbmRlciBsb29wXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xufTtcblxuR3JhcGhpY3NTeXN0ZW0ucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbigpIHtcblx0Ly8gU2V0IHRoZSBjYW52YXMgdG8gdGhlIGNvcnJlY3Qgc2l6ZSBpZiB0aGUgd2luZG93IGlzIHJlc2l6ZWRcblx0aWYgKHRoaXMuY2FudmFzLndpZHRoICE9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoIHx8XG5cdFx0dGhpcy5jYW52YXMuaGVpZ2h0ICE9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodCkge1xuXHRcdFx0dGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy5vZmZzZXRXaWR0aDtcblx0XHRcdHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodDtcblx0XHR9XG5cblx0Ly8gQ2xlYXIgdGhlIGNhbnZhc1xuXHR0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXG5cdHRoaXMuY29udGV4dC5zYXZlKCk7XG5cdHRoaXMuY29udGV4dC50cmFuc2xhdGUodGhpcy5jYW52YXMud2lkdGggLyAyLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHR0aGlzLmNvbnRleHQuc2NhbGUodGhpcy5jYW52YXMuaGVpZ2h0LCAtdGhpcy5jYW52YXMuaGVpZ2h0KTtcdC8vZmxpcHMgdGhlIHkgY29vcmRcblxuXHQvLyBSZW5kZXJpbmcgZ29lcyBoZXJlXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBlbnRpdHkgPSB0aGlzLmVudGl0aWVzW2ldO1xuXHRcdGlmICghKCdncmFwaGljcycgaW4gZW50aXR5LmNvbXBvbmVudHMpKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0ZW50aXR5LmNvbXBvbmVudHMuZ3JhcGhpY3MuZHJhdyh0aGlzLmNvbnRleHQpO1xuXHR9XG5cblx0dGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcblxuXHQvLyBDb250aW51ZSB0aGUgcmVuZGVyIGxvb3Bcblx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XG59O1xuXG5leHBvcnRzLkdyYXBoaWNzU3lzdGVtID0gR3JhcGhpY3NTeXN0ZW07XG4iLCJ2YXIgSW5wdXRTeXN0ZW0gPSBmdW5jdGlvbihlbnRpdGllcykge1xuXHR0aGlzLmVudGl0aWVzID0gZW50aXRpZXM7XG5cblx0Ly8gQ2FudmFzIGlzIHdoZXJlIHdlIGdldCBpbnB1dCBmcm9tXG5cdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY2FudmFzJyk7XG59O1xuXG5JbnB1dFN5c3RlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsaWNrLmJpbmQodGhpcykpO1xufTtcblxuSW5wdXRTeXN0ZW0ucHJvdG90eXBlLm9uQ2xpY2sgPSBmdW5jdGlvbigpIHtcblx0dmFyIGJpcmQgPSB0aGlzLmVudGl0aWVzWzBdO1xuXHRiaXJkLmNvbXBvbmVudHMucGh5c2ljcy52ZWxvY2l0eS55ID0gMC42O1xufTtcblxuZXhwb3J0cy5JbnB1dFN5c3RlbSA9IElucHV0U3lzdGVtO1xuIiwidmFyIFBoeXNpY3NTeXN0ZW0gPSBmdW5jdGlvbihlbnRpdGllcykge1xuXHR0aGlzLmVudGl0aWVzID0gZW50aXRpZXM7XG59O1xuXG5QaHlzaWNzU3lzdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbigpIHtcblx0Ly8gUnVuIHRoZSB1cGRhdGUgbG9vcFxuXHR3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy50aWNrLmJpbmQodGhpcyksIDEwMDAgLyA2MCk7XG59O1xuXG5QaHlzaWNzU3lzdGVtLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy4gZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZW50aXR5ID0gdGhpcy5lbnRpdGllc1tpXTtcblx0XHRpZiAoISgncGh5c2ljcycgaW4gZW50aXR5LmNvbXBvbmVudHMpKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0ZW50aXR5LmNvbXBvbmVudHMucGh5c2ljcy51cGRhdGUoMS82MCk7XG5cdH1cbn07XG5cbmV4cG9ydHMuUGh5c2ljc1N5c3RlbSA9IFBoeXNpY3NTeXN0ZW07XG4iLCJ2YXIgcGlwZSA9IHJlcXVpcmUoJy4uL2VudGl0aWVzL3BpcGUnKTtcblxudmFyIFBpcGVzU3lzdGVtID0gZnVuY3Rpb24oZW50aXRpZXMpIHtcblx0dGhpcy5lbnRpdGllcyA9IGVudGl0aWVzO1xufTtcblxuUGlwZXNTeXN0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuXHQvLyBSdW4gdGhlIHVwZGF0ZSBsb29wXG5cdHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLnRpY2suYmluZCh0aGlzKSwgMjAwMCk7XG59O1xuXG5QaXBlc1N5c3RlbS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZygnSW4gUGlwZXNTeXN0ZW0nKTtcblx0dmFyIHBpcGVCb3R0b20gPSBuZXcgcGlwZS5QaXBlKHsgeDogMSwgeTogMCB9KTtcblx0dmFyIHBpcGVUb3AgPSBuZXcgcGlwZS5QaXBlKHsgeDogMSwgeTogMC42IH0pO1xuXHR0aGlzLmVudGl0aWVzLnB1c2gocGlwZUJvdHRvbSwgcGlwZVRvcCk7XG59O1xuXG5leHBvcnRzLlBpcGVzU3lzdGVtID0gUGlwZXNTeXN0ZW07XG4iXX0=
