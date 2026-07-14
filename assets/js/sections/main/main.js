"use strict";


import displayPanel, {displayIcon, displayIconGrid} from "/assets/js/components/panel.js";

export default function displayMainWindow(){
    const panel = displayPanel('☏ Dialer Functions');
    const iconGrid = displayIconGrid();
    panel.append(iconGrid);

    const hiddenInput = document.createElement('input');
    hiddenInput.type = "file";
    hiddenInput.style.display = "none";
    hiddenInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const fileReader = new FileReader();

        fileReader.onload = async(e) => {
          const data = e.target.result;
          const b64 = data.split(",", 2)[1];
          const bl = hiddenInput.dataset.businessLine;
          const result = await window.pywebview.api.main.process_file_upload(file.name, b64, bl);
        };

        fileReader.readAsDataURL(file);
    });

    iconGrid.addIcon(displayIcon("CRI Dialer", () => {
        hiddenInput.dataset.businessLine = 'CRI';
        hiddenInput.click();

    }, null,'/assets/images/icons/genesys_icon_256.png'));

    iconGrid.addIcon(displayIcon('RPED Dialer', () => {
        hiddenInput.dataset.businessLine = 'RPED';
        hiddenInput.click();

    },null,null,'☏'));
    return panel;
}