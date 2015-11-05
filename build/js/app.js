(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BirdGraphicsComponent = function(entity) {
	this.entity = entity;
};

BirdGraphicsComponent.prototype.draw = function(context) {
	console.log("Drawing a bird");
	// Draw a circle for testing purposes
	context.beginPath();
	context.arc(0, 0.1, 0.1, 0, 2 * Math.PI);
	context.fillStyle = "red";
	context.fill();
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
var graphicsComponent = require("../components/graphics/bird");

var Bird = function() {
	console.log("Creating Bird Entity");

	var graphics = new graphicsComponent.BirdGraphicsComponent(this);
	this.components = {
		graphics: graphics
	};
};

exports.Bird = Bird;

},{"../components/graphics/bird":1}],4:[function(require,module,exports){
var graphicsComponent = require("../components/graphics/pipe");

var Pipe = function() {
	console.log("Creating Pipe entity");

	var graphics = new graphicsComponent.PipeGraphicsComponent(this);
	this.components = {
		graphics: graphics
	};
};

exports.Pipe = Pipe;

},{"../components/graphics/pipe":2}],5:[function(require,module,exports){
var graphicsSystem = require('./systems/graphics');
var bird = require('./entities/bird');
var pipe = require('./entities/pipe');

var FlappyBird = function() {
	this.entities = [new bird.Bird(), new pipe.Pipe()];
	this.graphics = new graphicsSystem.GraphicsSystem(this.entities);
};

FlappyBird.prototype.run = function() {
	this.graphics.run();
};

exports.FlappyBird = FlappyBird;

},{"./entities/bird":3,"./entities/pipe":4,"./systems/graphics":7}],6:[function(require,module,exports){
var flappyBird = require('./flappy_bird');

document.addEventListener('DOMContentLoaded', function() {
	var app = new flappyBird.FlappyBird();
	app.run();
});

},{"./flappy_bird":5}],7:[function(require,module,exports){
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

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jb21wb25lbnRzL2dyYXBoaWNzL2JpcmQuanMiLCJqcy9jb21wb25lbnRzL2dyYXBoaWNzL3BpcGUuanMiLCJqcy9lbnRpdGllcy9iaXJkLmpzIiwianMvZW50aXRpZXMvcGlwZS5qcyIsImpzL2ZsYXBweV9iaXJkLmpzIiwianMvbWFpbi5qcyIsImpzL3N5c3RlbXMvZ3JhcGhpY3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQmlyZEdyYXBoaWNzQ29tcG9uZW50ID0gZnVuY3Rpb24oZW50aXR5KSB7XG5cdHRoaXMuZW50aXR5ID0gZW50aXR5O1xufTtcblxuQmlyZEdyYXBoaWNzQ29tcG9uZW50LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY29udGV4dCkge1xuXHRjb25zb2xlLmxvZyhcIkRyYXdpbmcgYSBiaXJkXCIpO1xuXHQvLyBEcmF3IGEgY2lyY2xlIGZvciB0ZXN0aW5nIHB1cnBvc2VzXG5cdGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdGNvbnRleHQuYXJjKDAsIDAuMSwgMC4xLCAwLCAyICogTWF0aC5QSSk7XG5cdGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZWRcIjtcblx0Y29udGV4dC5maWxsKCk7XG59O1xuXG5leHBvcnRzLkJpcmRHcmFwaGljc0NvbXBvbmVudCA9IEJpcmRHcmFwaGljc0NvbXBvbmVudDtcbiIsInZhciBQaXBlR3JhcGhpY3NDb21wb25lbnQgPSBmdW5jdGlvbihlbnRpdHkpIHtcblx0dGhpcy5lbnRpdHkgPSBlbnRpdHk7XG59O1xuXG5QaXBlR3JhcGhpY3NDb21wb25lbnQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coXCJEcmF3aW5nIGEgcGlwZVwiKTtcbn07XG5cbmV4cG9ydHMuUGlwZUdyYXBoaWNzQ29tcG9uZW50ID0gUGlwZUdyYXBoaWNzQ29tcG9uZW50O1xuIiwidmFyIGdyYXBoaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvZ3JhcGhpY3MvYmlyZFwiKTtcblxudmFyIEJpcmQgPSBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coXCJDcmVhdGluZyBCaXJkIEVudGl0eVwiKTtcblxuXHR2YXIgZ3JhcGhpY3MgPSBuZXcgZ3JhcGhpY3NDb21wb25lbnQuQmlyZEdyYXBoaWNzQ29tcG9uZW50KHRoaXMpO1xuXHR0aGlzLmNvbXBvbmVudHMgPSB7XG5cdFx0Z3JhcGhpY3M6IGdyYXBoaWNzXG5cdH07XG59O1xuXG5leHBvcnRzLkJpcmQgPSBCaXJkO1xuIiwidmFyIGdyYXBoaWNzQ29tcG9uZW50ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvZ3JhcGhpY3MvcGlwZVwiKTtcblxudmFyIFBpcGUgPSBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coXCJDcmVhdGluZyBQaXBlIGVudGl0eVwiKTtcblxuXHR2YXIgZ3JhcGhpY3MgPSBuZXcgZ3JhcGhpY3NDb21wb25lbnQuUGlwZUdyYXBoaWNzQ29tcG9uZW50KHRoaXMpO1xuXHR0aGlzLmNvbXBvbmVudHMgPSB7XG5cdFx0Z3JhcGhpY3M6IGdyYXBoaWNzXG5cdH07XG59O1xuXG5leHBvcnRzLlBpcGUgPSBQaXBlO1xuIiwidmFyIGdyYXBoaWNzU3lzdGVtID0gcmVxdWlyZSgnLi9zeXN0ZW1zL2dyYXBoaWNzJyk7XG52YXIgYmlyZCA9IHJlcXVpcmUoJy4vZW50aXRpZXMvYmlyZCcpO1xudmFyIHBpcGUgPSByZXF1aXJlKCcuL2VudGl0aWVzL3BpcGUnKTtcblxudmFyIEZsYXBweUJpcmQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5lbnRpdGllcyA9IFtuZXcgYmlyZC5CaXJkKCksIG5ldyBwaXBlLlBpcGUoKV07XG5cdHRoaXMuZ3JhcGhpY3MgPSBuZXcgZ3JhcGhpY3NTeXN0ZW0uR3JhcGhpY3NTeXN0ZW0odGhpcy5lbnRpdGllcyk7XG59O1xuXG5GbGFwcHlCaXJkLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbigpIHtcblx0dGhpcy5ncmFwaGljcy5ydW4oKTtcbn07XG5cbmV4cG9ydHMuRmxhcHB5QmlyZCA9IEZsYXBweUJpcmQ7XG4iLCJ2YXIgZmxhcHB5QmlyZCA9IHJlcXVpcmUoJy4vZmxhcHB5X2JpcmQnKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuXHR2YXIgYXBwID0gbmV3IGZsYXBweUJpcmQuRmxhcHB5QmlyZCgpO1xuXHRhcHAucnVuKCk7XG59KTtcbiIsInZhciBHcmFwaGljc1N5c3RlbSA9IGZ1bmN0aW9uKGVudGl0aWVzKSB7XG5cdHRoaXMuZW50aXRpZXMgPSBlbnRpdGllcztcblx0Ly8gQ2FudmFzIGlzIHdoZXJlIHdlIGRyYXdcblx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1jYW52YXMnKTtcblx0Ly8gQ2FudmFzIGlzIHdoYXQgd2UgZHJhdyB0b1xuXHR0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xufTtcblxuR3JhcGhpY3NTeXN0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuXHQvLyBSdW4gdGhlIHJlbmRlciBsb29wXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xufTtcblxuR3JhcGhpY3NTeXN0ZW0ucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbigpIHtcblx0Ly8gU2V0IHRoZSBjYW52YXMgdG8gdGhlIGNvcnJlY3Qgc2l6ZSBpZiB0aGUgd2luZG93IGlzIHJlc2l6ZWRcblx0aWYgKHRoaXMuY2FudmFzLndpZHRoICE9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoIHx8XG5cdFx0dGhpcy5jYW52YXMuaGVpZ2h0ICE9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodCkge1xuXHRcdFx0dGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy5vZmZzZXRXaWR0aDtcblx0XHRcdHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodDtcblx0XHR9XG5cblx0Ly8gQ2xlYXIgdGhlIGNhbnZhc1xuXHR0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXG5cdHRoaXMuY29udGV4dC5zYXZlKCk7XG5cdHRoaXMuY29udGV4dC50cmFuc2xhdGUodGhpcy5jYW52YXMud2lkdGggLyAyLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHR0aGlzLmNvbnRleHQuc2NhbGUodGhpcy5jYW52YXMuaGVpZ2h0LCAtdGhpcy5jYW52YXMuaGVpZ2h0KTtcdC8vZmxpcHMgdGhlIHkgY29vcmRcblxuXHQvLyBSZW5kZXJpbmcgZ29lcyBoZXJlXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBlbnRpdHkgPSB0aGlzLmVudGl0aWVzW2ldO1xuXHRcdGlmICghJ2dyYXBoaWNzJyBpbiBlbnRpdHkuY29tcG9uZW50cykge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGVudGl0eS5jb21wb25lbnRzLmdyYXBoaWNzLmRyYXcodGhpcy5jb250ZXh0KTtcblx0fVxuXG5cdHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG5cblx0Ly8gQ29udGludWUgdGhlIHJlbmRlciBsb29wXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xufTtcblxuZXhwb3J0cy5HcmFwaGljc1N5c3RlbSA9IEdyYXBoaWNzU3lzdGVtO1xuIl19
