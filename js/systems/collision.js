var pipe = require('../entities/pipe');
var bird = require('../entities/bird');
var edge = require('../entities/edge');

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

			if (entityA instanceof bird.Bird || entityB instanceof bird.Bird) {
				this.removePipes();
			}

			if (entityA instanceof edge.Edge) {
				this.removeEntity(entityB);
			}

			if (entityB instanceof edge.Edge) {
				this.removeEntity(entityA);
			}
		}
	}
};

CollisionSystem.prototype.removePipes = function(context) {
	// Loop over the existing pipes & remove them
	var entitiesCopy = this.entities.slice();   // copy the array
	for (var i = 0; i < entitiesCopy.length; i++) {
		if (entitiesCopy[i] instanceof pipe.Pipe) {
			// Remove the pipe from the array
			this.removeEntity(entitiesCopy[i]);
		}
	}
};

CollisionSystem.prototype.removeEntity = function(entity) {
	// Remove the first two pipes from the array
	console.log('In removeEntity');
	this.entities.splice(this.entities.indexOf(entity), 1);
};

exports.CollisionSystem = CollisionSystem;
