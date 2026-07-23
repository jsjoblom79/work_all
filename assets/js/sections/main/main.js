"use strict";


import displayPanel, {displayIcon, displayIconGrid} from "/assets/js/components/panel.js";
import displayAlert from "/assets/js/components/alertMessage.js";
import mapAndRender from "/assets/js/components/file_mapper.js";
import displayButton from "/assets/js/components/button.js";

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
            let result
            switch (hiddenInput.dataset.businessLine) {
                case "CRI":
                    result = await window.pywebview.api.main.process_file_upload(file.name, streamData, hiddenInput.dataset.businessLine);

                    break;
                case "RPED":
                    result = await window.pywebview.api.main.process_rped_file(e.target.files[0].name, streamData, hiddenInput.dataset.businessLine);

            }
            if (result.result) {
                        panel.prepend(displayAlert(`File: ${file.name} processes. `, 'success'));
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

    iconGrid.addIcon(displayIcon('CaseWorth Upload', async() => {
        const results = await window.pywebview.api.main.open_file();
        const mappingFields = await window.pywebview.api.main.get_canon_synonyms();
        const renderedTable = await mapAndRender(mappingFields.canon, results.header, mappingFields.synonyms);
        panel.append(renderedTable);
        const mapBtn = await displayButton('Map',['gs-btn--primary'], async() => {
            const data = renderedTable.getData();
            const mapping = {};
            data.forEach(sel => {
                if(sel.destination !== '-1'){
                    mapping[sel.destination] = sel.id;
                }

            });
            const result = await window.pywebview.api.main.write_file(mapping);
            if(result.result){
                panel.prepend(displayAlert(`${result.path} SAVED!`, 'success'));
                panel.removeElement(renderedTable);
                panel.removeElement(mapBtn);
            }

        });
        panel.append(mapBtn);

    }, null,null, '🗂️'));
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