"use strict";

import displayButton from "/assets/js/components/button.js";
import {notifyLinkSelected, returnISODate} from "/assets/js/helper/helper_functions.js";

export default function displayDashboardGrid(){
    const dashboard = document.createElement('div');
    dashboard.classList.add('gs-dashboard-grid');
    dashboard.addElements = (...elements) => { dashboard.append(...elements); };
    dashboard.removeElement = (element) => { dashboard.removeChild(element); };
    dashboard.addElement = (element) => { dashboard.appendChild(element); };
    return dashboard;
}

export function displayDashboardBox(title, data=null){
    const box = document.createElement('div');
    box.classList.add('gs-dashboard-box');

    const header = document.createElement('h2');
    header.textContent = title;
    box.append(header);

    if(data !== null){
       data.forEach(item => {
       const row = displayStatLine(item);
       box.append(row);
    });
    }

    box.updateData = (data) => {
        const rows = data.map(item => displayStatLine(item));
        box.replaceChildren(header,...rows);
    }
    box.AddContent = (...element) => {
        box.append(...element);
    }
    box.removeContent = () => {
        box.replaceChildren();
    }

    return box;
}

export function displayStatLine(item){

    const row = document.createElement('div');
    row.classList.add('gs-stat-row');

    if(item.is_link){
        const buttonLink = displayButton(item['key'],['gs-btn--link'], () => {
            notifyLinkSelected();
        });
        row.append(buttonLink);
    } else {
        const label = document.createElement('span');
        label.classList.add('gs-stat-label');
        label.textContent = item['key'];
        row.append(label);
    }

    const stat = document.createElement('span');
    stat.classList.add('gs-stat-value');
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if(regex.test(item['value'])){
        stat.textContent = returnISODate(item['value']);
    } else {
        stat.textContent = item['value'];
    }

    row.append(stat);
    return row;
}