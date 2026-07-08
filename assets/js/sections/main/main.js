"use strict";


import displayPanel, {displayIcon, displayIconGrid} from "/assets/js/components/panel.js";

export default function displayMainWindow(){
    const panel = displayPanel('☏ Dialer Functions');
    const iconGrid = displayIconGrid();
    panel.append(iconGrid);

    iconGrid.addIcon(displayIcon("CRI Dialer", () =>{}, null,'/assets/images/icons/genesys_icon_256.png'));
    iconGrid.addIcon(displayIcon('RPED Dialer', () => {},null,null,'☏'));
    return panel;
}