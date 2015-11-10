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
	return false;
};

exports.CircleCollisionComponent = CircleCollisionComponent;
