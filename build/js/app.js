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

PipeGraphicsComponent.prototype.draw = function() {
	console.log("Drawing a pipe");
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

var Pipe = function() {
	console.log("Creating Pipe entity");

	var graphics = new graphicsComponent.PipeGraphicsComponent(this);
	this.components = {
		graphics: graphics
	};
};

exports.Pipe = Pipe;

},{"../components/graphics/pipe":2}],6:[function(require,module,exports){
var graphicsSystem = require('./systems/graphics');
var physicsSystem = require('./systems/physics');
var inputSystem = require('./systems/input');
var bird = require('./entities/bird');
var pipe = require('./entities/pipe');

var FlappyBird = function() {
	this.entities = [new bird.Bird(), new pipe.Pipe()];
	this.graphics = new graphicsSystem.GraphicsSystem(this.entities);
	this.physics = new physicsSystem.PhysicsSystem(this.entities);
	this.input = new inputSystem.InputSystem(this.entities);
};

FlappyBird.prototype.run = function() {
	this.graphics.run();
	this.physics.run();
	this.input.run();
};

exports.FlappyBird = FlappyBird;

},{"./entities/bird":4,"./entities/pipe":5,"./systems/graphics":8,"./systems/input":9,"./systems/physics":10}],7:[function(require,module,exports){
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
		if (!'graphics' in entity.components) {
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
		if (!'physics' in entity.components) {
			continue;
		}
		entity.components.physics.update(1/60);
	}
};

exports.PhysicsSystem = PhysicsSystem;

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jb21wb25lbnRzL2dyYXBoaWNzL2JpcmQuanMiLCJqcy9jb21wb25lbnRzL2dyYXBoaWNzL3BpcGUuanMiLCJqcy9jb21wb25lbnRzL3BoeXNpY3MvcGh5c2ljcy5qcyIsImpzL2VudGl0aWVzL2JpcmQuanMiLCJqcy9lbnRpdGllcy9waXBlLmpzIiwianMvZmxhcHB5X2JpcmQuanMiLCJqcy9tYWluLmpzIiwianMvc3lzdGVtcy9ncmFwaGljcy5qcyIsImpzL3N5c3RlbXMvaW5wdXQuanMiLCJqcy9zeXN0ZW1zL3BoeXNpY3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQmlyZEdyYXBoaWNzQ29tcG9uZW50ID0gZnVuY3Rpb24oZW50aXR5KSB7XG5cdHRoaXMuZW50aXR5ID0gZW50aXR5O1xufTtcblxuQmlyZEdyYXBoaWNzQ29tcG9uZW50LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY29udGV4dCkge1xuXHR2YXIgcG9zaXRpb24gPSB0aGlzLmVudGl0eS5jb21wb25lbnRzLnBoeXNpY3MucG9zaXRpb247XG5cblx0Y29udGV4dC5zYXZlKCk7XG5cdGNvbnRleHQudHJhbnNsYXRlKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRjb250ZXh0LmFyYygwLCAwLCAwLjAyLCAwLCAyICogTWF0aC5QSSk7XG5cdGNvbnRleHQuZmlsbCgpO1xuXHRjb250ZXh0LmNsb3NlUGF0aCgpO1xuXHRjb250ZXh0LnJlc3RvcmUoKTtcbn07XG5cbmV4cG9ydHMuQmlyZEdyYXBoaWNzQ29tcG9uZW50ID0gQmlyZEdyYXBoaWNzQ29tcG9uZW50O1xuIiwidmFyIFBpcGVHcmFwaGljc0NvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHR0aGlzLmVudGl0eSA9IGVudGl0eTtcbn07XG5cblBpcGVHcmFwaGljc0NvbXBvbmVudC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZyhcIkRyYXdpbmcgYSBwaXBlXCIpO1xufTtcblxuZXhwb3J0cy5QaXBlR3JhcGhpY3NDb21wb25lbnQgPSBQaXBlR3JhcGhpY3NDb21wb25lbnQ7XG4iLCJ2YXIgUGh5c2ljc0NvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHR0aGlzLmVudGl0eSA9IGVudGl0eTtcblxuXHR0aGlzLnBvc2l0aW9uID0ge1xuXHRcdHg6IDAsXG5cdFx0eTogMFxuXHR9O1xuXHR0aGlzLnZlbG9jaXR5ID0ge1xuXHRcdHg6IDAsXG5cdFx0eTogMFxuXHR9O1xuXHR0aGlzLmFjY2VsZXJhdGlvbiA9IHtcblx0XHR4OiAwLFxuXHRcdHk6IDBcblx0fTtcbn07XG5cblBoeXNpY3NDb21wb25lbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRlbHRhKSB7XG5cdHRoaXMudmVsb2NpdHkueCArPSB0aGlzLmFjY2VsZXJhdGlvbi54ICogZGVsdGE7XG5cdHRoaXMudmVsb2NpdHkueSArPSB0aGlzLmFjY2VsZXJhdGlvbi55ICogZGVsdGE7XG5cblx0dGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueCAqIGRlbHRhO1xuXHR0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogZGVsdGE7XG59O1xuXG5leHBvcnRzLlBoeXNpY3NDb21wb25lbnQgPSBQaHlzaWNzQ29tcG9uZW50O1xuIiwidmFyIGdyYXBoaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvZ3JhcGhpY3MvYmlyZFwiKTtcbnZhciBwaHlzaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvcGh5c2ljcy9waHlzaWNzXCIpO1xuXG52YXIgQmlyZCA9IGZ1bmN0aW9uKCkge1xuXHQvLyBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIEJpcmQgRW50aXR5XCIpO1xuXHR2YXIgcGh5c2ljcyA9IG5ldyBwaHlzaWNzQ29tcG9uZW50LlBoeXNpY3NDb21wb25lbnQodGhpcyk7XG5cdHBoeXNpY3MucG9zaXRpb24ueSA9IDAuNTtcblx0cGh5c2ljcy5hY2NlbGVyYXRpb24ueSA9IC0yO1x0Ly8gSG93IHN0cm9uZyBncmF2aXR5IGlzXG5cblx0dmFyIGdyYXBoaWNzID0gbmV3IGdyYXBoaWNzQ29tcG9uZW50LkJpcmRHcmFwaGljc0NvbXBvbmVudCh0aGlzKTtcblxuXHR0aGlzLmNvbXBvbmVudHMgPSB7XG5cdFx0cGh5c2ljczogcGh5c2ljcyxcblx0XHRncmFwaGljczogZ3JhcGhpY3Ncblx0fTtcbn07XG5cbmV4cG9ydHMuQmlyZCA9IEJpcmQ7XG4iLCJ2YXIgZ3JhcGhpY3NDb21wb25lbnQgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9ncmFwaGljcy9waXBlXCIpO1xuXG52YXIgUGlwZSA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZyhcIkNyZWF0aW5nIFBpcGUgZW50aXR5XCIpO1xuXG5cdHZhciBncmFwaGljcyA9IG5ldyBncmFwaGljc0NvbXBvbmVudC5QaXBlR3JhcGhpY3NDb21wb25lbnQodGhpcyk7XG5cdHRoaXMuY29tcG9uZW50cyA9IHtcblx0XHRncmFwaGljczogZ3JhcGhpY3Ncblx0fTtcbn07XG5cbmV4cG9ydHMuUGlwZSA9IFBpcGU7XG4iLCJ2YXIgZ3JhcGhpY3NTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbXMvZ3JhcGhpY3MnKTtcbnZhciBwaHlzaWNzU3lzdGVtID0gcmVxdWlyZSgnLi9zeXN0ZW1zL3BoeXNpY3MnKTtcbnZhciBpbnB1dFN5c3RlbSA9IHJlcXVpcmUoJy4vc3lzdGVtcy9pbnB1dCcpO1xudmFyIGJpcmQgPSByZXF1aXJlKCcuL2VudGl0aWVzL2JpcmQnKTtcbnZhciBwaXBlID0gcmVxdWlyZSgnLi9lbnRpdGllcy9waXBlJyk7XG5cbnZhciBGbGFwcHlCaXJkID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuZW50aXRpZXMgPSBbbmV3IGJpcmQuQmlyZCgpLCBuZXcgcGlwZS5QaXBlKCldO1xuXHR0aGlzLmdyYXBoaWNzID0gbmV3IGdyYXBoaWNzU3lzdGVtLkdyYXBoaWNzU3lzdGVtKHRoaXMuZW50aXRpZXMpO1xuXHR0aGlzLnBoeXNpY3MgPSBuZXcgcGh5c2ljc1N5c3RlbS5QaHlzaWNzU3lzdGVtKHRoaXMuZW50aXRpZXMpO1xuXHR0aGlzLmlucHV0ID0gbmV3IGlucHV0U3lzdGVtLklucHV0U3lzdGVtKHRoaXMuZW50aXRpZXMpO1xufTtcblxuRmxhcHB5QmlyZC5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuZ3JhcGhpY3MucnVuKCk7XG5cdHRoaXMucGh5c2ljcy5ydW4oKTtcblx0dGhpcy5pbnB1dC5ydW4oKTtcbn07XG5cbmV4cG9ydHMuRmxhcHB5QmlyZCA9IEZsYXBweUJpcmQ7XG4iLCJ2YXIgZmxhcHB5QmlyZCA9IHJlcXVpcmUoJy4vZmxhcHB5X2JpcmQnKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuXHR2YXIgYXBwID0gbmV3IGZsYXBweUJpcmQuRmxhcHB5QmlyZCgpO1xuXHRhcHAucnVuKCk7XG59KTtcbiIsInZhciBHcmFwaGljc1N5c3RlbSA9IGZ1bmN0aW9uKGVudGl0aWVzKSB7XG5cdHRoaXMuZW50aXRpZXMgPSBlbnRpdGllcztcblx0Ly8gQ2FudmFzIGlzIHdoZXJlIHdlIGRyYXdcblx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1jYW52YXMnKTtcblx0Ly8gQ2FudmFzIGlzIHdoYXQgd2UgZHJhdyB0b1xuXHR0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xufTtcblxuR3JhcGhpY3NTeXN0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuXHQvLyBSdW4gdGhlIHJlbmRlciBsb29wXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xufTtcblxuR3JhcGhpY3NTeXN0ZW0ucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbigpIHtcblx0Ly8gU2V0IHRoZSBjYW52YXMgdG8gdGhlIGNvcnJlY3Qgc2l6ZSBpZiB0aGUgd2luZG93IGlzIHJlc2l6ZWRcblx0aWYgKHRoaXMuY2FudmFzLndpZHRoICE9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoIHx8XG5cdFx0dGhpcy5jYW52YXMuaGVpZ2h0ICE9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodCkge1xuXHRcdFx0dGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy5vZmZzZXRXaWR0aDtcblx0XHRcdHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodDtcblx0XHR9XG5cblx0Ly8gQ2xlYXIgdGhlIGNhbnZhc1xuXHR0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXG5cdHRoaXMuY29udGV4dC5zYXZlKCk7XG5cdHRoaXMuY29udGV4dC50cmFuc2xhdGUodGhpcy5jYW52YXMud2lkdGggLyAyLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHR0aGlzLmNvbnRleHQuc2NhbGUodGhpcy5jYW52YXMuaGVpZ2h0LCAtdGhpcy5jYW52YXMuaGVpZ2h0KTtcdC8vZmxpcHMgdGhlIHkgY29vcmRcblxuXHQvLyBSZW5kZXJpbmcgZ29lcyBoZXJlXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBlbnRpdHkgPSB0aGlzLmVudGl0aWVzW2ldO1xuXHRcdGlmICghJ2dyYXBoaWNzJyBpbiBlbnRpdHkuY29tcG9uZW50cykge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGVudGl0eS5jb21wb25lbnRzLmdyYXBoaWNzLmRyYXcodGhpcy5jb250ZXh0KTtcblx0fVxuXG5cdHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG5cblx0Ly8gQ29udGludWUgdGhlIHJlbmRlciBsb29wXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xufTtcblxuZXhwb3J0cy5HcmFwaGljc1N5c3RlbSA9IEdyYXBoaWNzU3lzdGVtO1xuIiwidmFyIElucHV0U3lzdGVtID0gZnVuY3Rpb24oZW50aXRpZXMpIHtcblx0dGhpcy5lbnRpdGllcyA9IGVudGl0aWVzO1xuXG5cdC8vIENhbnZhcyBpcyB3aGVyZSB3ZSBnZXQgaW5wdXQgZnJvbVxuXHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNhbnZhcycpO1xufTtcblxuSW5wdXRTeXN0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljay5iaW5kKHRoaXMpKTtcbn07XG5cbklucHV0U3lzdGVtLnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdHZhciBiaXJkID0gdGhpcy5lbnRpdGllc1swXTtcblx0YmlyZC5jb21wb25lbnRzLnBoeXNpY3MudmVsb2NpdHkueSA9IDAuNjtcbn07XG5cbmV4cG9ydHMuSW5wdXRTeXN0ZW0gPSBJbnB1dFN5c3RlbTtcbiIsInZhciBQaHlzaWNzU3lzdGVtID0gZnVuY3Rpb24oZW50aXRpZXMpIHtcblx0dGhpcy5lbnRpdGllcyA9IGVudGl0aWVzO1xufTtcblxuUGh5c2ljc1N5c3RlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cdC8vIFJ1biB0aGUgdXBkYXRlIGxvb3Bcblx0d2luZG93LnNldEludGVydmFsKHRoaXMudGljay5iaW5kKHRoaXMpLCAxMDAwIC8gNjApO1xufTtcblxuUGh5c2ljc1N5c3RlbS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuIGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGVudGl0eSA9IHRoaXMuZW50aXRpZXNbaV07XG5cdFx0aWYgKCEncGh5c2ljcycgaW4gZW50aXR5LmNvbXBvbmVudHMpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRlbnRpdHkuY29tcG9uZW50cy5waHlzaWNzLnVwZGF0ZSgxLzYwKTtcblx0fVxufTtcblxuZXhwb3J0cy5QaHlzaWNzU3lzdGVtID0gUGh5c2ljc1N5c3RlbTtcbiJdfQ==
