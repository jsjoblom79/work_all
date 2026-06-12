import displayMainMenu from '/assets/js/AppBase/menu.js';
import displayAppTitleBar from "/assets/js/AppBase/appTitleBar.js";
import displayFooter from '/assets/js/AppBase/displayFooter.js';

"use strict";
export default async function displayTitleAndMenu(){
    const win = document.createElement('div');
    win.classList.add('gs-screen');
    const menu = await displayMainMenu();
    const titleBar = await displayAppTitleBar('JMS Systems', 'copyright (c) 2026 jms');
    const footer = await displayFooter('Main','System');

    const body = document.createElement('div');
    win.append(titleBar, menu, body, footer);

    win.appendElements = (...elements) => { body.append(...elements); };
    win.appendElement = (element) => {body.append(element); };
    win.removeElement = () => { body.innerHTML = ``; };
    win.clearBody = () => { body.replaceChildren(); };
    win.mainMenu = menu;
    return win;
}