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
