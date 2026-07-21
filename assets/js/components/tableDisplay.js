"use strict";

import displayButton from "/assets/js/components/button.js";

export default async function displayTables(tableId, headerArray, dataArray, filterTableResultsArray=[]){
    const tableDiv = document.createElement('div');
    const table = document.createElement('table');
    table.id=tableId;
    table.classList.add('gs-table');
    const thead = document.createElement('thead');
    thead.style.position = 'sticky';
    thead.style.background = '#050e05';
    const first_tr = document.createElement('tr');
    for(const item of headerArray){
        const th = document.createElement('th');
        th.textContent = item;
        th.style.position = 'sticky';
        th.style.top = '0';
        th.style.zIndex = '2';
        th.style.background = '#050e05';

        first_tr.append(th);
    }
    thead.append(first_tr);
    const tbody = document.createElement('tbody');

    const getRows = () => {
        Array.from(tbody.rows).forEach(row => row.classList.remove('selected-row'));
    };

    const resolveKeyOrder = (data) => {
        const filter = filterTableResultsArray.length ? filterTableResultsArray : null;
        if (filterTableResultsArray.length) {
            return filterTableResultsArray.filter(k => (!filter || filter.includes(k)) && Object.prototype.hasOwnProperty.call(data, k));
        }
        return filter ? filter.filter(k => Object.prototype.hasOwnProperty.call(data, k)) : Object.keys(data);
    };

    const createRow = (data) => {
        const tr = document.createElement('tr');

        for (const key of resolveKeyOrder(data)) {
            const td = document.createElement('td');
            if(data[key] instanceof Object){
                td.append(data[key]);
            } else {
                if (key.includes('date') && data[key] != null) {
                    const [year, month, day] = data[key].substring(0, 10).split('-');
                    td.textContent = `${month}/${day}/${year}`;//data[key].substring(0, 10);
                } else if (key.includes('phone')) {
                    const phone = data[key];
                    const prefix = phone.substring(0, 3);
                    const id = phone.substring(3, 6);
                    const postfix = phone.substring(6, 10);
                    td.innerHTML = `<a href="tel:+1${phone}" target="_blank">(${prefix}) ${id}-${postfix}</a>`;
                } else if (key.includes('email')) {
                    td.innerHTML = `<a href="mailto:${data[key]}" target="_blank">${data[key]}</a>`;
                } else if (typeof data[key] === 'boolean') {
                    if (data[key]) {
                        td.textContent = 'X';
                    } else {
                        td.textContent = '';
                    }
                } else if (key.includes('edit')) {
                    if (Array.isArray(data[key])) {
                        const btnDiv = document.createElement('div');
                        btnDiv.style.display = 'flex';
                        btnDiv.style.gap = '5px';
                        data[key].forEach(item => {
                            btnDiv.append(item);
                        });
                        td.append(btnDiv);
                    } else {
                        td.append(data[key]);
                    }

                } else {
                    td.textContent = data[key];
                }
            }
            tr.append(td);
        }
        tr.addEventListener('click', ()=>{
            if(tr.classList.contains('selected-row')){
                tr.classList.remove('selected-row');
                tableDiv.selectedRow = null;
                tableDiv.dispatchEvent(new CustomEvent('rowselect', { detail: null }));
            } else {
                getRows();
                tr.classList.add('selected-row');
                tableDiv.selectedRow = data;
                tableDiv.dispatchEvent(new CustomEvent('rowselect', { detail: data }));
            }
        });
        return tr;
    }
    tbody.append(...dataArray.map(createRow));
    tableDiv.style.maxHeight = "300px";
    tableDiv.style.overflowY = 'auto';
    table.selectedRow = null;
    table.append(thead, tbody);
    tableDiv.append(table);
    let tableData = [];
    tableDiv.addRow = (data) => {
        data['edit'] = displayButton('remove',['gs-btn--danger', 'gs-btn--sm'], () => {
           const index = tableData.findIndex(product => product.id === data['id']);
           tableData.splice(index, 1);
           tableDiv.refresh(tableData);
        });
        tbody.append(createRow(data));
        tableData.push(data);
    };
    tableDiv.clearData = () => {
        tableData.length = 0;
        tableDiv.refresh(tableData);
    }
    tableDiv.refresh = (newDataArray) => {
        tbody.replaceChildren(...newDataArray.map(createRow));
        tableDiv.selectedRow = null;
    };
    tableDiv.getData = () => {
        if(tableData.length == 0){
            for(let i = 1; i < table.rows.length; i++){
                const row = table.rows[i];
                const id = row.cells[0].innerText.trim();
                const sName = row.cells[1].querySelector("select");
                const option = sName ? sName.value : null;
                tableData.push({'id': id, 'destination': option});
            }

        }
        return tableData;
    };
    tableDiv.removeObject = (obj) => {
        tableData.pop(obj);
    };
    return tableDiv;
}