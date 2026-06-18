"use strict";

import displayWindow from "/assets/js/components/displayWindow.js";
import displayTables from "/assets/js/components/tableDisplay.js";
import displayTextAreaField from "/assets/js/components/textareaField.js";
import displayButton from "/assets/js/components/button.js";
import displayAlert from "/assets/js/components/alertMessage.js";

let notesListWindow;
let notesAddWindow;

export default async function displayNotesWindow(vendorId){
    const mainWin = displayWindow('Notes');
    notesListWindow = await displayNotesList(vendorId);
    notesAddWindow = await displayNotesAdd(vendorId);
    mainWin.winBody.append(notesAddWindow, notesListWindow);
    return mainWin;
}

export async function displayNotesList(vendorId){
    const listWin = displayWindow('Notes List', true, false);
    const notes = await window.pywebview.api.vendor.get_all_notes(vendorId);
    const noteTable = await displayTables(
        'vendor-comments',
        ['Date', 'Note'],
        notes,
        ['create_date', 'comment']
        );

    listWin.refresh = async() => {
        const notes = await window.pywebview.api.vendor.get_all_notes(vendorId);
        noteTable.refresh(notes)
    };
    listWin.winBody.append(noteTable);
    return listWin;
}

export async function displayNotesAdd(vendorId){
    const addWin = displayWindow('Add Note', true, false);
    const noteText = await displayTextAreaField('Comment',3,'note-comment');
    const addBtn = displayButton('Add',['gs-btn', 'gs-btn--primary'],async() => {
       const results = await window.pywebview.api.vendor.add_note({
           vendor_id: vendorId,
           comment: noteText.input.value
       });
       if(results.result){
           addWin.prepend(await displayAlert('Message was added. ', 'success'));
           noteText.input.value = null;
           notesListWindow.refresh();
       } else {
           addWin.prepend(await displayAlert('Message was not added. ', 'error'));
       }
    });
    addWin.winBody.append(noteText, addBtn);
    return addWin;
}