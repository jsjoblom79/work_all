"use strict";

export default function displayDashboardGrid(){
    const dashboard = document.createElement('div');
    dashboard.classList.add('gs-dashboard-grid');
    dashboard.addElements = (...elements) => { dashboard.append(...elements); };
    dashboard.removeElement = (element) => {dashboard.removeElement(element); };
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
       const row = document.createElement('div');
       row.classList.add('gs-stat-row');
       const label = document.createElement('span');
       label.classList.add('gs-stat-label');
       label.textContent = item['key'];
       const stat = document.createElement('span');
       stat.classList.add('gs-stat-value');
       stat.textContent = item['value'];
       row.append(label, stat);
       box.append(row);
    });
    }

    box.AddContent = (...element) => {
        box.append(...element);
    }
    box.removeContent = () => {
        box.replaceChildren();
    }

    return box;
}