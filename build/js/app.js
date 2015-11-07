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
	var position = { x: 0.75, y: 0 };

	context.save();
	context.translate(position.x, position.y);
	context.beginPath();
	context.fillStyle = "green";
	context.fillRect(0, 0, 0.1, 0.2);
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

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jb21wb25lbnRzL2dyYXBoaWNzL2JpcmQuanMiLCJqcy9jb21wb25lbnRzL2dyYXBoaWNzL3BpcGUuanMiLCJqcy9jb21wb25lbnRzL3BoeXNpY3MvcGh5c2ljcy5qcyIsImpzL2VudGl0aWVzL2JpcmQuanMiLCJqcy9lbnRpdGllcy9waXBlLmpzIiwianMvZmxhcHB5X2JpcmQuanMiLCJqcy9tYWluLmpzIiwianMvc3lzdGVtcy9ncmFwaGljcy5qcyIsImpzL3N5c3RlbXMvaW5wdXQuanMiLCJqcy9zeXN0ZW1zL3BoeXNpY3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBCaXJkR3JhcGhpY3NDb21wb25lbnQgPSBmdW5jdGlvbihlbnRpdHkpIHtcblx0dGhpcy5lbnRpdHkgPSBlbnRpdHk7XG59O1xuXG5CaXJkR3JhcGhpY3NDb21wb25lbnQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjb250ZXh0KSB7XG5cdHZhciBwb3NpdGlvbiA9IHRoaXMuZW50aXR5LmNvbXBvbmVudHMucGh5c2ljcy5wb3NpdGlvbjtcblxuXHRjb250ZXh0LnNhdmUoKTtcblx0Y29udGV4dC50cmFuc2xhdGUocG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG5cdGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdGNvbnRleHQuYXJjKDAsIDAsIDAuMDIsIDAsIDIgKiBNYXRoLlBJKTtcblx0Y29udGV4dC5maWxsKCk7XG5cdGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cdGNvbnRleHQucmVzdG9yZSgpO1xufTtcblxuZXhwb3J0cy5CaXJkR3JhcGhpY3NDb21wb25lbnQgPSBCaXJkR3JhcGhpY3NDb21wb25lbnQ7XG4iLCJ2YXIgUGlwZUdyYXBoaWNzQ29tcG9uZW50ID0gZnVuY3Rpb24oZW50aXR5KSB7XG5cdHRoaXMuZW50aXR5ID0gZW50aXR5O1xufTtcblxuUGlwZUdyYXBoaWNzQ29tcG9uZW50LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY29udGV4dCkge1xuXHR2YXIgcG9zaXRpb24gPSB7IHg6IDAuNzUsIHk6IDAgfTtcblxuXHRjb250ZXh0LnNhdmUoKTtcblx0Y29udGV4dC50cmFuc2xhdGUocG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG5cdGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdGNvbnRleHQuZmlsbFN0eWxlID0gXCJncmVlblwiO1xuXHRjb250ZXh0LmZpbGxSZWN0KDAsIDAsIDAuMSwgMC4yKTtcblx0Y29udGV4dC5jbG9zZVBhdGgoKTtcblx0Y29udGV4dC5yZXN0b3JlKCk7XG59O1xuXG5leHBvcnRzLlBpcGVHcmFwaGljc0NvbXBvbmVudCA9IFBpcGVHcmFwaGljc0NvbXBvbmVudDtcbiIsInZhciBQaHlzaWNzQ29tcG9uZW50ID0gZnVuY3Rpb24oZW50aXR5KSB7XG5cdHRoaXMuZW50aXR5ID0gZW50aXR5O1xuXG5cdHRoaXMucG9zaXRpb24gPSB7XG5cdFx0eDogMCxcblx0XHR5OiAwXG5cdH07XG5cdHRoaXMudmVsb2NpdHkgPSB7XG5cdFx0eDogMCxcblx0XHR5OiAwXG5cdH07XG5cdHRoaXMuYWNjZWxlcmF0aW9uID0ge1xuXHRcdHg6IDAsXG5cdFx0eTogMFxuXHR9O1xufTtcblxuUGh5c2ljc0NvbXBvbmVudC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGVsdGEpIHtcblx0dGhpcy52ZWxvY2l0eS54ICs9IHRoaXMuYWNjZWxlcmF0aW9uLnggKiBkZWx0YTtcblx0dGhpcy52ZWxvY2l0eS55ICs9IHRoaXMuYWNjZWxlcmF0aW9uLnkgKiBkZWx0YTtcblxuXHR0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54ICogZGVsdGE7XG5cdHRoaXMucG9zaXRpb24ueSArPSB0aGlzLnZlbG9jaXR5LnkgKiBkZWx0YTtcbn07XG5cbmV4cG9ydHMuUGh5c2ljc0NvbXBvbmVudCA9IFBoeXNpY3NDb21wb25lbnQ7XG4iLCJ2YXIgZ3JhcGhpY3NDb21wb25lbnQgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9ncmFwaGljcy9iaXJkXCIpO1xudmFyIHBoeXNpY3NDb21wb25lbnQgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9waHlzaWNzL3BoeXNpY3NcIik7XG5cbnZhciBCaXJkID0gZnVuY3Rpb24oKSB7XG5cdC8vIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgQmlyZCBFbnRpdHlcIik7XG5cdHZhciBwaHlzaWNzID0gbmV3IHBoeXNpY3NDb21wb25lbnQuUGh5c2ljc0NvbXBvbmVudCh0aGlzKTtcblx0cGh5c2ljcy5wb3NpdGlvbi55ID0gMC41O1xuXHRwaHlzaWNzLmFjY2VsZXJhdGlvbi55ID0gLTI7XHQvLyBIb3cgc3Ryb25nIGdyYXZpdHkgaXNcblxuXHR2YXIgZ3JhcGhpY3MgPSBuZXcgZ3JhcGhpY3NDb21wb25lbnQuQmlyZEdyYXBoaWNzQ29tcG9uZW50KHRoaXMpO1xuXG5cdHRoaXMuY29tcG9uZW50cyA9IHtcblx0XHRwaHlzaWNzOiBwaHlzaWNzLFxuXHRcdGdyYXBoaWNzOiBncmFwaGljc1xuXHR9O1xufTtcblxuZXhwb3J0cy5CaXJkID0gQmlyZDtcbiIsInZhciBncmFwaGljc0NvbXBvbmVudCA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2dyYXBoaWNzL3BpcGVcIik7XG5cbnZhciBQaXBlID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgUGlwZSBlbnRpdHlcIik7XG5cblx0dmFyIGdyYXBoaWNzID0gbmV3IGdyYXBoaWNzQ29tcG9uZW50LlBpcGVHcmFwaGljc0NvbXBvbmVudCh0aGlzKTtcblx0dGhpcy5jb21wb25lbnRzID0ge1xuXHRcdGdyYXBoaWNzOiBncmFwaGljc1xuXHR9O1xufTtcblxuZXhwb3J0cy5QaXBlID0gUGlwZTtcbiIsInZhciBncmFwaGljc1N5c3RlbSA9IHJlcXVpcmUoJy4vc3lzdGVtcy9ncmFwaGljcycpO1xudmFyIHBoeXNpY3NTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbXMvcGh5c2ljcycpO1xudmFyIGlucHV0U3lzdGVtID0gcmVxdWlyZSgnLi9zeXN0ZW1zL2lucHV0Jyk7XG52YXIgYmlyZCA9IHJlcXVpcmUoJy4vZW50aXRpZXMvYmlyZCcpO1xudmFyIHBpcGUgPSByZXF1aXJlKCcuL2VudGl0aWVzL3BpcGUnKTtcblxudmFyIEZsYXBweUJpcmQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5lbnRpdGllcyA9IFtuZXcgYmlyZC5CaXJkKCksIG5ldyBwaXBlLlBpcGUoKV07XG5cdHRoaXMuZ3JhcGhpY3MgPSBuZXcgZ3JhcGhpY3NTeXN0ZW0uR3JhcGhpY3NTeXN0ZW0odGhpcy5lbnRpdGllcyk7XG5cdHRoaXMucGh5c2ljcyA9IG5ldyBwaHlzaWNzU3lzdGVtLlBoeXNpY3NTeXN0ZW0odGhpcy5lbnRpdGllcyk7XG5cdHRoaXMuaW5wdXQgPSBuZXcgaW5wdXRTeXN0ZW0uSW5wdXRTeXN0ZW0odGhpcy5lbnRpdGllcyk7XG59O1xuXG5GbGFwcHlCaXJkLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbigpIHtcblx0dGhpcy5ncmFwaGljcy5ydW4oKTtcblx0dGhpcy5waHlzaWNzLnJ1bigpO1xuXHR0aGlzLmlucHV0LnJ1bigpO1xufTtcblxuZXhwb3J0cy5GbGFwcHlCaXJkID0gRmxhcHB5QmlyZDtcbiIsInZhciBmbGFwcHlCaXJkID0gcmVxdWlyZSgnLi9mbGFwcHlfYmlyZCcpO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG5cdHZhciBhcHAgPSBuZXcgZmxhcHB5QmlyZC5GbGFwcHlCaXJkKCk7XG5cdGFwcC5ydW4oKTtcbn0pO1xuIiwidmFyIEdyYXBoaWNzU3lzdGVtID0gZnVuY3Rpb24oZW50aXRpZXMpIHtcblx0dGhpcy5lbnRpdGllcyA9IGVudGl0aWVzO1xuXHQvLyBDYW52YXMgaXMgd2hlcmUgd2UgZHJhd1xuXHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNhbnZhcycpO1xuXHQvLyBDYW52YXMgaXMgd2hhdCB3ZSBkcmF3IHRvXG5cdHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG59O1xuXG5HcmFwaGljc1N5c3RlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cdC8vIFJ1biB0aGUgcmVuZGVyIGxvb3Bcblx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XG59O1xuXG5HcmFwaGljc1N5c3RlbS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuXHQvLyBTZXQgdGhlIGNhbnZhcyB0byB0aGUgY29ycmVjdCBzaXplIGlmIHRoZSB3aW5kb3cgaXMgcmVzaXplZFxuXHRpZiAodGhpcy5jYW52YXMud2lkdGggIT0gdGhpcy5jYW52YXMub2Zmc2V0V2lkdGggfHxcblx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgIT0gdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0KSB7XG5cdFx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoO1xuXHRcdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0O1xuXHRcdH1cblxuXHQvLyBDbGVhciB0aGUgY2FudmFzXG5cdHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG5cblx0dGhpcy5jb250ZXh0LnNhdmUoKTtcblx0dGhpcy5jb250ZXh0LnRyYW5zbGF0ZSh0aGlzLmNhbnZhcy53aWR0aCAvIDIsIHRoaXMuY2FudmFzLmhlaWdodCk7XG5cdHRoaXMuY29udGV4dC5zY2FsZSh0aGlzLmNhbnZhcy5oZWlnaHQsIC10aGlzLmNhbnZhcy5oZWlnaHQpO1x0Ly9mbGlwcyB0aGUgeSBjb29yZFxuXG5cdC8vIFJlbmRlcmluZyBnb2VzIGhlcmVcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGVudGl0eSA9IHRoaXMuZW50aXRpZXNbaV07XG5cdFx0aWYgKCEoJ2dyYXBoaWNzJyBpbiBlbnRpdHkuY29tcG9uZW50cykpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRlbnRpdHkuY29tcG9uZW50cy5ncmFwaGljcy5kcmF3KHRoaXMuY29udGV4dCk7XG5cdH1cblxuXHR0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG5cdC8vIENvbnRpbnVlIHRoZSByZW5kZXIgbG9vcFxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcbn07XG5cbmV4cG9ydHMuR3JhcGhpY3NTeXN0ZW0gPSBHcmFwaGljc1N5c3RlbTtcbiIsInZhciBJbnB1dFN5c3RlbSA9IGZ1bmN0aW9uKGVudGl0aWVzKSB7XG5cdHRoaXMuZW50aXRpZXMgPSBlbnRpdGllcztcblxuXHQvLyBDYW52YXMgaXMgd2hlcmUgd2UgZ2V0IGlucHV0IGZyb21cblx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1jYW52YXMnKTtcbn07XG5cbklucHV0U3lzdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2suYmluZCh0aGlzKSk7XG59O1xuXG5JbnB1dFN5c3RlbS5wcm90b3R5cGUub25DbGljayA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgYmlyZCA9IHRoaXMuZW50aXRpZXNbMF07XG5cdGJpcmQuY29tcG9uZW50cy5waHlzaWNzLnZlbG9jaXR5LnkgPSAwLjY7XG59O1xuXG5leHBvcnRzLklucHV0U3lzdGVtID0gSW5wdXRTeXN0ZW07XG4iLCJ2YXIgUGh5c2ljc1N5c3RlbSA9IGZ1bmN0aW9uKGVudGl0aWVzKSB7XG5cdHRoaXMuZW50aXRpZXMgPSBlbnRpdGllcztcbn07XG5cblBoeXNpY3NTeXN0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuXHQvLyBSdW4gdGhlIHVwZGF0ZSBsb29wXG5cdHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLnRpY2suYmluZCh0aGlzKSwgMTAwMCAvIDYwKTtcbn07XG5cblBoeXNpY3NTeXN0ZW0ucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbigpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLiBlbnRpdGllcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBlbnRpdHkgPSB0aGlzLmVudGl0aWVzW2ldO1xuXHRcdGlmICghKCdwaHlzaWNzJyBpbiBlbnRpdHkuY29tcG9uZW50cykpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRlbnRpdHkuY29tcG9uZW50cy5waHlzaWNzLnVwZGF0ZSgxLzYwKTtcblx0fVxufTtcblxuZXhwb3J0cy5QaHlzaWNzU3lzdGVtID0gUGh5c2ljc1N5c3RlbTtcbiJdfQ==
