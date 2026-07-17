"use strict";


import displayPanel, {displayIcon, displayIconGrid} from "/assets/js/components/panel.js";
import displayAlert from "/assets/js/components/alertMessage.js";
import mapAndRender from "/assets/js/components/file_mapper.js";

export default function displayMainWindow(){
    const panel = displayPanel('☏ Dialer Functions');
    const iconGrid = displayIconGrid();
    panel.append(iconGrid);


    const hiddenInput = document.createElement('input');
    hiddenInput.type = "file";
    hiddenInput.style.display = "none";
    hiddenInput.addEventListener('change', async(e) => {
        const streamData = await getData(e);

        if(streamData !== null) {
            switch (hiddenInput.dataset.businessLine) {
                case "CRI":
                    const result = await window.pywebview.api.main.process_file_upload(file.name, streamData, hiddenInput.dataset.businessLine);
                    if (result.result) {
                        panel.prepend(displayAlert(`File: ${file.name} processes. `, 'success'));
                    }
                    break;
                case "RPED":
                    if (await window.pywebview.api.main.process_rped_file(e.target.files[0].name, streamData)['result']) {
                        console.log("passed");
                    }
            }
        }
    });

    iconGrid.addIcon(displayIcon("CRI Dialer", () => {
        hiddenInput.dataset.businessLine = 'CRI';
        hiddenInput.click();

    }, null,'/assets/images/icons/genesys_icon_256.png'));

    iconGrid.addIcon(displayIcon('RPED Dialer', () => {
        hiddenInput.dataset.businessLine = 'RPED';
        hiddenInput.click();

    },null,null,'☏'));

    iconGrid.addIcon(displayIcon('CaseWorthy Upload', () => {
        hiddenInput.dataset.businessLine = 'RPED';
        hiddenInput.click();
    }, null, null, '🗂️'));

    iconGrid.addIcon(displayIcon('TEST', async() => {
        const results = await window.pywebview.api.main.open_file();
        const mappingFields = await window.pywebview.api.main.get_canon_synonyms();


        panel.innerHTML = `<table> 
        <thead>
        <tr>
        <th>Incoming Field</th>
        <th>Mapped Filed</th>
        <th>Status</th>
        </tr>
        </thead>
        <tbody>
        ${mapAndRender(mappingFields.canon, results.header, mappingFields.synonyms)} 
        </tbody>
        </table>`;

    }, null,null, '🧐'));
    const getData = (e) =>{
        const file = e.target.files[0];
        return new Promise((resolve, reject) =>{
            const fileReader = new FileReader();
            fileReader.onload = (evt) => resolve(evt.target.result.slice(evt.target.result.indexOf(',') + 1));
            fileReader.onerror = reject;
            fileReader.readAsDataURL(file);
        });
    }
    return panel;
}