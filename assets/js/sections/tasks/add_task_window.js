"use strict";


import displayWindow from "/assets/js/components/displayWindow.js";
import displayField from "/assets/js/components/inputField.js";
import displayButton from "/assets/js/components/button.js";
import displayTextAreaField from "/assets/js/components/textareaField.js";
import displayAlert from "/assets/js/components/alertMessage.js";
import displayTables from "/assets/js/components/tableDisplay.js";
import displayTaskDetail from "/assets/js/sections/tasks/task_detail.js";


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
        console.log(new_task);
        const result = await window.pywebview.api.task.add_task(new_task);
        if(result.result){
            addTaskWin.winBody.prepend(displayAlert(`${new_task['title']} has been added.`, 'success'));
            clearFields();
            allTaskWin.refresh();
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
           displayButton('complete', ['gs-btn--sm', 'gs-btn--primary'], (e) => {
               console.log(`The task name is: ${task.title}`);
           }),
           displayButton('delete', ['gs-btn--sm', 'gs-btn--danger'], (e) => {

           })
       ];
    });
    const taskTable = await displayTables('all-tasks',['Title', 'Description', 'edit'],allTasks,['title', 'description','edit']);

    allTaskWin.addContent(taskTable);

    allTaskWin.refresh = async() => {
        const allTasks = await window.pywebview.api.task.get_all_tasks();
        allTasks.forEach(task => {
            task['edit'] = displayButton('complete',['gs-btn--primary'],() => {});
        });
        taskTable.refresh(allTasks);
    };
    taskTable.addEventListener('rowselect', async (e) =>{
        allTaskWin.dispatchEvent(new CustomEvent('taskselected', {detail: e.detail}));
    });

    allTaskWin.taskDetail = () => {}
    return allTaskWin;
}