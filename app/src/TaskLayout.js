import SpTaskEndpoint from "../layouts/SpTaskEndpoint.vue";
import SpTaskLoopback from "../layouts/SpTaskLoopback.vue";

const TaskLayout = {
	'task.endpoint': SpTaskEndpoint,
	'task.loopback': SpTaskLoopback
};

export default TaskLayout;
export const getTaskByTaskID = id => TaskLayout[id];
