(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BirdGraphicsComponent = function(entity) {
	this.entity = entity;
};

BirdGraphicsComponent.prototype.draw = function(context) {
	var position = {x: 0, y: 0.5};

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
var physicsSystem = require('./systems/physics');
var bird = require('./entities/bird');
var pipe = require('./entities/pipe');

var FlappyBird = function() {
	this.entities = [new bird.Bird(), new pipe.Pipe()];
	this.graphics = new graphicsSystem.GraphicsSystem(this.entities);
	this.physics = new physicsSystem.PhysicsSystem(this.entities);
};

FlappyBird.prototype.run = function() {
	this.graphics.run();
	this.physics.run();
};

exports.FlappyBird = FlappyBird;

},{"./entities/bird":3,"./entities/pipe":4,"./systems/graphics":7,"./systems/physics":8}],6:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jb21wb25lbnRzL2dyYXBoaWNzL2JpcmQuanMiLCJqcy9jb21wb25lbnRzL2dyYXBoaWNzL3BpcGUuanMiLCJqcy9lbnRpdGllcy9iaXJkLmpzIiwianMvZW50aXRpZXMvcGlwZS5qcyIsImpzL2ZsYXBweV9iaXJkLmpzIiwianMvbWFpbi5qcyIsImpzL3N5c3RlbXMvZ3JhcGhpY3MuanMiLCJqcy9zeXN0ZW1zL3BoeXNpY3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEJpcmRHcmFwaGljc0NvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHR0aGlzLmVudGl0eSA9IGVudGl0eTtcbn07XG5cbkJpcmRHcmFwaGljc0NvbXBvbmVudC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcblx0dmFyIHBvc2l0aW9uID0ge3g6IDAsIHk6IDAuNX07XG5cblx0Y29udGV4dC5zYXZlKCk7XG5cdGNvbnRleHQudHJhbnNsYXRlKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRjb250ZXh0LmFyYygwLCAwLCAwLjAyLCAwLCAyICogTWF0aC5QSSk7XG5cdGNvbnRleHQuZmlsbCgpO1xuXHRjb250ZXh0LmNsb3NlUGF0aCgpO1xuXHRjb250ZXh0LnJlc3RvcmUoKTtcbn07XG5cbmV4cG9ydHMuQmlyZEdyYXBoaWNzQ29tcG9uZW50ID0gQmlyZEdyYXBoaWNzQ29tcG9uZW50O1xuIiwidmFyIFBpcGVHcmFwaGljc0NvbXBvbmVudCA9IGZ1bmN0aW9uKGVudGl0eSkge1xuXHR0aGlzLmVudGl0eSA9IGVudGl0eTtcbn07XG5cblBpcGVHcmFwaGljc0NvbXBvbmVudC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZyhcIkRyYXdpbmcgYSBwaXBlXCIpO1xufTtcblxuZXhwb3J0cy5QaXBlR3JhcGhpY3NDb21wb25lbnQgPSBQaXBlR3JhcGhpY3NDb21wb25lbnQ7XG4iLCJ2YXIgZ3JhcGhpY3NDb21wb25lbnQgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9ncmFwaGljcy9iaXJkXCIpO1xuXG52YXIgQmlyZCA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZyhcIkNyZWF0aW5nIEJpcmQgRW50aXR5XCIpO1xuXG5cdHZhciBncmFwaGljcyA9IG5ldyBncmFwaGljc0NvbXBvbmVudC5CaXJkR3JhcGhpY3NDb21wb25lbnQodGhpcyk7XG5cdHRoaXMuY29tcG9uZW50cyA9IHtcblx0XHRncmFwaGljczogZ3JhcGhpY3Ncblx0fTtcbn07XG5cbmV4cG9ydHMuQmlyZCA9IEJpcmQ7XG4iLCJ2YXIgZ3JhcGhpY3NDb21wb25lbnQgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9ncmFwaGljcy9waXBlXCIpO1xuXG52YXIgUGlwZSA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZyhcIkNyZWF0aW5nIFBpcGUgZW50aXR5XCIpO1xuXG5cdHZhciBncmFwaGljcyA9IG5ldyBncmFwaGljc0NvbXBvbmVudC5QaXBlR3JhcGhpY3NDb21wb25lbnQodGhpcyk7XG5cdHRoaXMuY29tcG9uZW50cyA9IHtcblx0XHRncmFwaGljczogZ3JhcGhpY3Ncblx0fTtcbn07XG5cbmV4cG9ydHMuUGlwZSA9IFBpcGU7XG4iLCJ2YXIgZ3JhcGhpY3NTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbXMvZ3JhcGhpY3MnKTtcbnZhciBwaHlzaWNzU3lzdGVtID0gcmVxdWlyZSgnLi9zeXN0ZW1zL3BoeXNpY3MnKTtcbnZhciBiaXJkID0gcmVxdWlyZSgnLi9lbnRpdGllcy9iaXJkJyk7XG52YXIgcGlwZSA9IHJlcXVpcmUoJy4vZW50aXRpZXMvcGlwZScpO1xuXG52YXIgRmxhcHB5QmlyZCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmVudGl0aWVzID0gW25ldyBiaXJkLkJpcmQoKSwgbmV3IHBpcGUuUGlwZSgpXTtcblx0dGhpcy5ncmFwaGljcyA9IG5ldyBncmFwaGljc1N5c3RlbS5HcmFwaGljc1N5c3RlbSh0aGlzLmVudGl0aWVzKTtcblx0dGhpcy5waHlzaWNzID0gbmV3IHBoeXNpY3NTeXN0ZW0uUGh5c2ljc1N5c3RlbSh0aGlzLmVudGl0aWVzKTtcbn07XG5cbkZsYXBweUJpcmQucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmdyYXBoaWNzLnJ1bigpO1xuXHR0aGlzLnBoeXNpY3MucnVuKCk7XG59O1xuXG5leHBvcnRzLkZsYXBweUJpcmQgPSBGbGFwcHlCaXJkO1xuIiwidmFyIGZsYXBweUJpcmQgPSByZXF1aXJlKCcuL2ZsYXBweV9iaXJkJyk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcblx0dmFyIGFwcCA9IG5ldyBmbGFwcHlCaXJkLkZsYXBweUJpcmQoKTtcblx0YXBwLnJ1bigpO1xufSk7XG4iLCJ2YXIgR3JhcGhpY3NTeXN0ZW0gPSBmdW5jdGlvbihlbnRpdGllcykge1xuXHR0aGlzLmVudGl0aWVzID0gZW50aXRpZXM7XG5cdC8vIENhbnZhcyBpcyB3aGVyZSB3ZSBkcmF3XG5cdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY2FudmFzJyk7XG5cdC8vIENhbnZhcyBpcyB3aGF0IHdlIGRyYXcgdG9cblx0dGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbn07XG5cbkdyYXBoaWNzU3lzdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbigpIHtcblx0Ly8gUnVuIHRoZSByZW5kZXIgbG9vcFxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcbn07XG5cbkdyYXBoaWNzU3lzdGVtLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oKSB7XG5cdC8vIFNldCB0aGUgY2FudmFzIHRvIHRoZSBjb3JyZWN0IHNpemUgaWYgdGhlIHdpbmRvdyBpcyByZXNpemVkXG5cdGlmICh0aGlzLmNhbnZhcy53aWR0aCAhPSB0aGlzLmNhbnZhcy5vZmZzZXRXaWR0aCB8fFxuXHRcdHRoaXMuY2FudmFzLmhlaWdodCAhPSB0aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQpIHtcblx0XHRcdHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXMub2Zmc2V0V2lkdGg7XG5cdFx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQ7XG5cdFx0fVxuXG5cdC8vIENsZWFyIHRoZSBjYW52YXNcblx0dGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblxuXHR0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXHR0aGlzLmNvbnRleHQudHJhbnNsYXRlKHRoaXMuY2FudmFzLndpZHRoIC8gMiwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblx0dGhpcy5jb250ZXh0LnNjYWxlKHRoaXMuY2FudmFzLmhlaWdodCwgLXRoaXMuY2FudmFzLmhlaWdodCk7XHQvL2ZsaXBzIHRoZSB5IGNvb3JkXG5cblx0Ly8gUmVuZGVyaW5nIGdvZXMgaGVyZVxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZW50aXR5ID0gdGhpcy5lbnRpdGllc1tpXTtcblx0XHRpZiAoISdncmFwaGljcycgaW4gZW50aXR5LmNvbXBvbmVudHMpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRlbnRpdHkuY29tcG9uZW50cy5ncmFwaGljcy5kcmF3KHRoaXMuY29udGV4dCk7XG5cdH1cblxuXHR0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG5cdC8vIENvbnRpbnVlIHRoZSByZW5kZXIgbG9vcFxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcbn07XG5cbmV4cG9ydHMuR3JhcGhpY3NTeXN0ZW0gPSBHcmFwaGljc1N5c3RlbTtcbiIsInZhciBQaHlzaWNzU3lzdGVtID0gZnVuY3Rpb24oZW50aXRpZXMpIHtcblx0dGhpcy5lbnRpdGllcyA9IGVudGl0aWVzO1xufTtcblxuUGh5c2ljc1N5c3RlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cdC8vIFJ1biB0aGUgdXBkYXRlIGxvb3Bcblx0d2luZG93LnNldEludGVydmFsKHRoaXMudGljay5iaW5kKHRoaXMpLCAxMDAwIC8gNjApO1xufTtcblxuUGh5c2ljc1N5c3RlbS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuIGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGVudGl0eSA9IHRoaXMuZW50aXRpZXNbaV07XG5cdFx0aWYgKCEncGh5c2ljcycgaW4gZW50aXR5LmNvbXBvbmVudHMpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRlbnRpdHkuY29tcG9uZW50cy5waHlzaWNzLnVwZGF0ZSgxLzYwKTtcblx0fVxufTtcblxuZXhwb3J0cy5QaHlzaWNzU3lzdGVtID0gUGh5c2ljc1N5c3RlbTtcbiJdfQ==
