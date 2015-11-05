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
