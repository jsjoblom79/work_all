"use strict";


import displayWindow from "/assets/js/components/displayWindow.js";
import displayField from "/assets/js/components/inputField.js";
import displayButton from "/assets/js/components/button.js";
import displayTextAreaField from "/assets/js/components/textareaField.js";
import displayAlert from "/assets/js/components/alertMessage.js";
import displayTables from "/assets/js/components/tableDisplay.js";
import {returnISODate, notifyStatsChanged} from "/assets/js/helper/helper_functions.js";


let addTaskWin;
let allTaskWin;

export default async function displayAddTaskWindow(){
    addTaskWin = displayWindow('Task Entry', true, false);

    const taskTitleField = await displayField('Title','task-title','text');
    const taskDescriptionField = await displayTextAreaField('Description', 3,'task-description');
    const taskFieldList = [taskTitleField, taskDescriptionField];
    const addBtn = displayButton('Add', 'gs-btn--primary', async() => {
        let new_task = {};
        taskFieldList.forEach(field => {
            const key = field.input.id.replace('task-','');
            new_task[key] = field.input.value;
        });
        let date = new Date();
        date.setDate(date.getDate() + 5);
        new_task['followup_date'] = returnISODate(date.toISOString());

        const result = await window.pywebview.api.task.add_task(new_task);
        if(result.result){
            addTaskWin.winBody.prepend(displayAlert(`${new_task['title']} has been added.`, 'success'));
            clearFields();
            allTaskWin.refresh();
            notifyStatsChanged();
        } else {
            addTaskWin.winBody.prepend(displayAlert(`${result.task} `, 'error'));
        }
    });

    const clearFields = () => {
        taskFieldList.forEach(field => { field.input.value = null; });
    }
    addTaskWin.addContent(taskTitleField, taskDescriptionField, addBtn);
    return addTaskWin;
}

export async function displayAllTasksWindow(){
    allTaskWin = displayWindow('All Tasks', true, false);
    const allTasks = await window.pywebview.api.task.get_all_tasks();

    allTasks.forEach(task => {
       task['edit'] = [
           displayButton('complete', ['gs-btn-table', 'gs-btn--primary'], async(e) => {
               const curTask = task;
               console.log(curTask.title);
               e.stopPropagation();

               curTask['is_complete'] = true;
               delete(curTask.edit);
               const result = await window.pywebview.api.task.update_task(curTask);
               if(result.result){
                   allTaskWin.winBody.prepend(displayAlert(`Task ${curTask.title} was marked completed `, 'success'));
                   allTaskWin.refresh();
                   notifyStatsChanged();
               } else {
                   allTaskWin.winBody.prepend(displayAlert('Error completing task. ', 'error'));
               }
           }),
           displayButton('delete', ['gs-btn-table', 'gs-btn--danger'], async(e) => {
               const curTask = task;
               console.log(curTask.title);
                e.stopPropagation();
                const result = await window.pywebview.api.task.delete_task(curTask.id);
                if(result.result){
                    allTaskWin.winBody.prepend(displayAlert(`Task ${curTask.title} was deleted. `, 'success'));
                    allTaskWin.refresh();
                    notifyStatsChanged();
                }
           })
       ];
    });
    const taskTable = await displayTables('all-tasks',['Title', 'Description', 'edit'],allTasks,['title', 'description','edit']);

    allTaskWin.addContent(taskTable);

    allTaskWin.refresh = async() => {
        const allTasks = await window.pywebview.api.task.get_all_tasks();
        allTasks.forEach(task => {
            task['edit'] = [
           displayButton('complete', ['gs-btn-table', 'gs-btn--primary'], async(e) => {
               const curTask = task;

               e.stopPropagation();
               curTask.is_complete = true;
               delete(curTask.edit);
               const result = await window.pywebview.api.task.update_task(curTask);
               if(result.result){
                   allTaskWin.winBody.prepend(displayAlert(`Task ${curTask.title} was marked completed `, 'success'));
                   allTaskWin.refresh();
                   notifyStatsChanged();
               } else {
                   allTaskWin.winBody.prepend(displayAlert('Error completing task. ', 'error'));
               }
           }),
           displayButton('delete', ['gs-btn-table', 'gs-btn--danger'], async(e) => {
               const curTask = task;

                e.stopPropagation();
                const result = await window.pywebview.api.task.delete_task(curTask.id);
                if(result.result){
                    allTaskWin.winBody.prepend(displayAlert(`Task ${curTask.title} was deleted. `, 'success'));
                    allTaskWin.refresh();
                    notifyStatsChanged();
                }
           })
       ];
        });
        taskTable.refresh(allTasks);
    };

    taskTable.addEventListener('rowselect', async (e) =>{
        allTaskWin.dispatchEvent(new CustomEvent('taskselected', {detail: e.detail}));
    });

    return allTaskWin;
}

