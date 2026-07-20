"use strict";

import displayWindow from "/assets/js/components/displayWindow.js";
import displayField from "/assets/js/components/inputField.js";
import displayTextAreaField from "/assets/js/components/textareaField.js";
import displayButton from "/assets/js/components/button.js";
import displayText from "/assets/js/components/display_text.js";
import displayTwoFields, {displayThreeFields} from "/assets/js/components/displayMultipleFields.js";
import displayTimer from "/assets/js/components/display_timer.js";
import displayDashboardGrid, {displayDashboardBox} from "/assets/js/components/dashboard_grid.js";
import {returnISODate} from "/assets/js/helper/helper_functions.js";
import displayTables from "/assets/js/components/tableDisplay.js";
import displayAlert from "/assets/js/components/alertMessage.js";

let taskDetailWin;
let taskDashboard;
let noteListWin;

export default async function displayTaskDetail(task){
    const taskTime = await window.pywebview.api.task.get_tracked_time_by_task(task.id);
    const notes = await window.pywebview.api.task.get_task_notes(task.id);
    const mainWin = document.createElement('div');

    taskDetailWin = await displayTaskInformation(task, taskTime);
    taskDashboard = displayDashboardGrid();
    const taskTimer = await displayTaskTimer(task);
    const taskAddNote = await displayAddtaskNotes(task);
    taskDashboard.addElements(taskTimer, taskAddNote);
    noteListWin = await displayTaskNotes(notes, task.id);
    mainWin.append(taskDetailWin, taskDashboard, noteListWin);

    return mainWin;
}


export async function displayTaskInformation(task, time){
    const taskWin = displayWindow(task.title,true, false);

    const taskTitle = await displayField('Title','task-title', 'text', task.title);
    const taskDescription = await displayTextAreaField('Description',3,'task-description', task.description);
    const taskCreateDate = await displayField('Create Date', 'task-create_date', 'date', returnISODate(task.create_date));
    const taskFollowupDate = await displayField('Follow Up', 'task-followup_date', 'date', returnISODate(task.followup_date));
    const taskLastWorked = await displayField('Last Worked', 'task-last_followup', 'date', returnISODate(task.last_followup));
    const taskCompleted = await displayField('Completed', 'task-is_complete', 'checkbox', task.is_completed);

    const fieldList = [taskTitle, taskDescription, taskCreateDate, taskFollowupDate, taskLastWorked, taskCompleted];

    const taskSaveBtn = await displayButton('Save',['gs-btn--primary'], async() => {
        let nTask = {
            'id': task.id
        }
        fieldList.forEach(field => {
            const key = field.input.id.replace('task-','');
            if(key.includes('date')){
                nTask[key] = returnISODate(field.input.value);
            } else if(key.includes('last_followup')) {
                const date = new Date();
                nTask[key] = returnISODate(date.toISOString());
            } else if(key.includes('complete')){
                nTask[key] = !!field.input.checked;
            } else {
                nTask[key] = field.input.value;
            }

        });
        const results = await window.pywebview.api.task.update_task(nTask);
        if(results.result){
            taskWin.prepend(displayAlert('Task has been updated.', 'success'));
        } else {
            taskWin.prepend(displayAlert('Error updating task', 'error'));
        }
    });
    const taskTotalTime = displayText(`Time Worked: ${time.taskTime}`,'h3');



    const line1 = displayTwoFields([taskTitle, taskCompleted]);
    const line3 = displayThreeFields([taskCreateDate, taskFollowupDate, taskLastWorked]);
    const line4 = displayTwoFields([taskSaveBtn, taskTotalTime]);


    taskWin.winBody.append(line1, taskDescription, line3, line4);

    taskWin.refresh = async() => {
        const tTime = await window.pywebview.api.task.get_tracked_time_by_task(task.id);
        taskTotalTime.setText(`Time Worked: ${tTime.taskTime}`);
    }


    return taskWin;
}

export async function displayTaskTimer(task){
    let timerRunning = false;
    let timerSeconds = 0 ;
    let timerInterval = null;
    let tracker;

    const startButton = displayButton('start', ['gs-btn--primary'],async() => {
       if(!timerRunning) {
           timerRunning = true;
           timerInterval = setInterval(() => {
               timerSeconds++;
               timerDisplay.updateTimer(formatTime(timerSeconds));
           }, 1000);

          tracker = await window.pywebview.api.task.add_time_tracked(task.id);
       }
    });
    const resetButton = displayButton('reset', ['gs-btn--primary'],() => {
        clearInterval(timerInterval);
        timerSeconds = 0;
        timerRunning = false;
        timerDisplay.resetTimer();
    });
    const stopButton = displayButton('stop', ['gs-btn--primary'],async() => {

        if(timerRunning){
            const trackedTime = tracker.result;

            const results = await window.pywebview.api.task.update_time_tracked(task.id);
            if(results.result){
                clearInterval(timerInterval)
                timerDisplay.resetTimer();
                timerSeconds = 0;
                timerRunning = false;
                taskDetailWin.refresh();
            }
        }
    });

    const timerDisplay = await displayTimer('Task Time',[startButton, resetButton, stopButton]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return timerDisplay;
}

export async function displayAddtaskNotes(task){
    const noteBox = displayDashboardBox('Add Notes');
    const notes = await displayTextAreaField('Note',3,'task-note')
    const addBtn = displayButton('Add',['gs-btn--primary'], async() => {
        let newNote = {
            'note': notes.input.value,
            'task_id': task.id
        }
        const results = await window.pywebview.api.task.add_note(newNote);
        if(results.result){
            noteBox.append(displayAlert("Note Added. ", 'success'));
            notes.input.value = null;
            noteListWin.refresh();
        } else {
            noteBox.append(displayAlert('Error adding note. ', 'error'));
        }
    });

    noteBox.AddContent(notes,addBtn);
    return noteBox
}

export async function displayTaskNotes(notes, taskId){
    noteListWin = displayWindow('Notes',true, true);
    console.log(notes);
    const noteList = await displayTables('task-note_list',['Date', 'Note'],notes,['create_date','note']);
    noteListWin.winBody.append(noteList);

    noteListWin.refresh = async () => {
        notes = await window.pywebview.api.task.get_task_notes(taskId);
        noteList.refresh(notes);
    }
    return noteListWin;
}