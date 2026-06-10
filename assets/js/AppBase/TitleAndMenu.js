import displayMainMenu from '/assets/js/AppBase/menu.js';
import displayAppTitleBar from "/assets/js/AppBase/appTitleBar.js";
import displayFooter from '/assets/js/AppBase/displayFooter.js';

"use strict";
export default async function displayTitleAndMenu(){
    const win = document.createElement('div');
    const alertDiv = document.createElement('div');
    alertDiv.id = 'alert-message';
    win.classList.add('gs-screen');
    const menu = await displayMainMenu();
    const titleBar = await displayAppTitleBar('JMS Systems', 'copyright (c) 2026 jms');
    const footer = await displayFooter('Main','System');

    const body = document.createElement('div');
    win.append(titleBar, menu, alertDiv, body, footer);

    win.appendElements = (...elements) => { body.append(...elements); };
    win.appendElement = (element) => {body.append(element); };
    win.clearBody = () => { body.replaceChildren(); };
    win.appendAlert = (alert) => { alertDiv.replaceChildren(); alertDiv.append(alert); }
    win.mainMenu = menu;
    return win;
}