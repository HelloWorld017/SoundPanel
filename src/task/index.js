const TaskDefaultEndpoint = require('./TaskDefaultEndpoint');
const TaskLoopback = require('./TaskLoopback');

module.exports = {
	getTaskByType(type) {
		switch(type) {
			case TaskDefaultEndpoint.type:
				return TaskDefaultEndpoint;

			case TaskLoopback.type:
				return TaskLoopback;
		}

		return null;
	},

	TaskDefaultEndpoint,
	TaskLoopback
};
