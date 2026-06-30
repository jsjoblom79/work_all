"use strict";

export default async function displayTaskDetail(task){
    const taskTime = await window.pywebview.api.task.get_tracked_time_by_task(task.id);
    const notes = await window.pywebview.api.task.get_task_notes(task.id);
}