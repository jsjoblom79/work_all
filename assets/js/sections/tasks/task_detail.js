"use strict";

import displayWindow from "/assets/js/components/displayWindow.js";
import displayField from "/assets/js/components/inputField.js";
import displayTextAreaField from "/assets/js/components/textareaField.js";
import displayButton from "/assets/js/components/button.js";
import displayText from "/assets/js/components/display_text.js";
import displayTwoFields, {displayThreeFields} from "/assets/js/components/displayMultipleFields.js";
import displayTimer from "/assets/js/components/display_timer.js";
import displayDashboardGrid from "/assets/js/components/dashboard_grid.js";
import {returnISODate} from "/assets/js/helper/helper_functions.js";

let taskDetailWin;
let taskDashboard;
let taskTimer;

export default async function displayTaskDetail(task){
    const taskTime = await window.pywebview.api.task.get_tracked_time_by_task(task.id);
    const notes = await window.pywebview.api.task.get_task_notes(task.id);
    const mainWin = document.createElement('div');

    taskDetailWin = displayTaskInformation(task);
    taskDashboard = displayDashboardGrid();
    taskTimer = displayTaskTimer(task);
    taskDashboard.addElement(taskTimer);
    mainWin.append(taskDetailWin);

    return mainWin;
}


export async function displayTaskInformation(task, time){
    const taskWin = displayWindow(task.title,true, false);

    const taskTitle = await displayField('Title','task-title', 'text');
    const taskDescription = await displayTextAreaField('Description',3,'task-detail');
    const taskCreateDate = await displayField('Create Date', 'task-create_date', 'date');
    const taskFollowupDate = await displayField('Follow Up', 'task-followup', 'date');
    const taskLastWorked = await displayField('Last Worked', 'task-last_followup', 'date');
    const taskCompleted = await displayField('Completed', 'task-is_completed', 'checkbox');

    const taskSaveBtn = await displayButton('Save',['gs-btn--primary'], () => {});
    const taskTotalTime = displayText(`Time Worked: ${time}`,'h1');

    const fieldList = [taskTitle, taskDescription, taskCreateDate, taskFollowupDate, taskLastWorked, taskCompleted];

    const line1 = displayTwoFields([taskTitle, taskCompleted]);
    const line3 = displayThreeFields([taskCreateDate, taskFollowupDate, taskLastWorked]);
    const line4 = displayTwoFields([taskSaveBtn, taskTotalTime]);


    taskWin.winBody.append(line1, taskDescription, line3, line4);

    fieldList.forEach(field => {
        const key = field.input.id.replace('task-','');
        if(key.includes('date')){
            field.input.value = returnISODate(task[key]);
        } else if(key.includes('completed')) {
            field.input.checked = !!task[key];
        } else {
            field.input.value = task[key];
        }

    });
    return taskWin;
}

export async function displayTaskTimer(task){
    let timerDisplay;
    const startButton = displayButton('start', ['gs-btn--primary', 'gs-btn--sm'],() => {

    });
    const resetButton = displayButton('reset', ['gs-btn--primary', 'gs-btn--sm'],() => {
        timerDisplay.resetTimer();
    });
    const stopButton = displayButton('stop', ['gs-btn--primary', 'gs-btn--sm'],() => {
        timerDisplay.resetTimer();
    });

    timerDisplay = await displayTimer('Task Time',[startButton, resetButton, stopButton]);

    return timerDisplay;
}