"use strict";

import displayWindow from "/assets/js/components/displayWindow.js";
import displayTables from "/assets/js/components/tableDisplay.js";

export default async function displayCompletedTasks(){
    const win = displayWindow('Completed Tasks', true, false);
    const tasks = await window.pywebview.api.task.get_completed_tasks();

    tasks.forEach(task => {
        let trackedTime;
        if(Array.isArray(task.time_tracking)){
            task.time_tracking.forEach(time => {
                trackedTime += time.endTime - time.startTime;
            });
        }
        //task.time_tracking = trackedTime;
    });
    
    const taskListTable = await displayTables('completed-tasks',
        ['Created', 'Title', 'Tracked-Time'],
        tasks,
        ['create_date', 'title','time_tracking']);
    win.winBody.append(taskListTable);
    return win;
}