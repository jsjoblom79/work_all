"use strict";

import displayDashboardGrid, {displayDashboardBox} from "/assets/js/components/dashboard_grid.js";
import displayAddTaskWindow, {displayAllTasksWindow} from "/assets/js/sections/tasks/add_task_window.js";
import displayTaskDetail, {displayTaskTimer} from "/assets/js/sections/tasks/task_detail.js";

export default async function displayTaskScreen(){
    const mainWin = document.createElement('div');

    const dashboard = displayDashboardGrid();
    const taskInfo = await window.pywebview.api.task.get_task_stats();
    const box1 = await displayDashboardBox("Tasks Info", taskInfo);
    const box2 = await displayDashboardBox("Follow Up", []);
    dashboard.addElements(box1, box2);

    const AddTaskWindow = await displayAddTaskWindow();

    const TaskListWindow = await displayAllTasksWindow();
    TaskListWindow.addEventListener('taskselected', async (e) => {
        const taskDetailWin = await displayTaskDetail(e.detail);
        mainWin.replaceChildren();
        mainWin.append(taskDetailWin);
    })

    mainWin.append(dashboard, AddTaskWindow, TaskListWindow);
    return mainWin;
}

export async function displayTaskDetailScreens(){

}