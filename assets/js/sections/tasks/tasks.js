"use strict";

import displayDashboardGrid, {displayDashboardBox} from "/assets/js/components/dashboard_grid.js";
import displayAddTaskWindow, {displayAllTasksWindow} from "/assets/js/sections/tasks/add_task_window.js";
import displayTaskDetail, {displayTaskTimer} from "/assets/js/sections/tasks/task_detail.js";
import displayCompletedTasks from "/assets/js/sections/tasks/completed_tasks.js";

export default async function displayTaskScreen(){
    const mainWin = document.createElement('div');

    const dashboard = displayDashboardGrid();
    const taskInfo = await window.pywebview.api.task.get_task_stats();
    const followupTasks = await window.pywebview.api.task.get_all_uncompleted_tasks();
    let box1 = await displayDashboardBox("Tasks Info", taskInfo);
    let box2 = await displayDashboardBox("Follow Up", followupTasks);
    dashboard.addElements(box1, box2);

    const AddTaskWindow = await displayAddTaskWindow();

    const TaskListWindow = await displayAllTasksWindow();
    TaskListWindow.addEventListener('taskselected', async (e) => {
        const taskDetailWin = await displayTaskDetail(e.detail);
        mainWin.replaceChildren();
        mainWin.append(taskDetailWin);
    });

    mainWin.refresh = async() =>{
        const taskInfo = await window.pywebview.api.task.get_task_stats();
        box1.updateData(taskInfo);
    };
    mainWin.completedTasks = async() => {
        const completedTaskWin = await displayCompletedTasks();
        mainWin.replaceChildren(completedTaskWin);
    }
    document.addEventListener('stats:changed', mainWin.refresh);
    document.addEventListener('link:clicked', mainWin.completedTasks);

    mainWin.append(dashboard, AddTaskWindow, TaskListWindow);
    return mainWin;
}

export async function displayTaskDetailScreens(){

}