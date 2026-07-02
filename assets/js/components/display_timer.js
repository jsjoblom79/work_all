"use strict";

export default async function displayTimer(title, buttonArray = []){
    const div = document.createElement('div');
    div.classList.add('gs-dashboard-box');
    const h2 = document.createElement('h2');
    h2.textContent = title;
    //Append the header
    div.append(h2);

    const outerDiv = document.createElement('div');
    outerDiv.style.textAlign = 'center';
    outerDiv.style.margin = '20px 0';


    const innerDiv = document.createElement('div');
    innerDiv.style.fontSize = '32px';
    innerDiv.style.fontWeight = 'bold';
    innerDiv.style.color = '#22cc22';
    innerDiv.style.letterSpacing = '4px';
    innerDiv.style.margin = '20px 0';
    innerDiv.style.border = '2px solid #22cc22';
    innerDiv.style.padding = '20px';

    const timerSpan = document.createElement('span');
    timerSpan.id = 'timer-display';
    timerSpan.textContent = '00:00:00';

    // Add Timer to inner div
    innerDiv.append(timerSpan);
    //Add innerdiv to outerdiv
    outerDiv.append(innerDiv);

    //Verify an array of buttons was included.
    if(Array.isArray(buttonArray)){
        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('gs-button-group');
        buttonArray.forEach(button => {
            buttonDiv.append(button);
        });
        outerDiv.append(buttonDiv);
    }

    div.append(outerDiv);

    div.updateTimer = async (time) => {
        timerSpan.textContent = time;
    };

    div.resetTimer = async () => {
        timerSpan.textContent = '00:00:00';
    };

    div.stopTimer = async () => {
        timerSpan.textContent = '00:00:00';
    }
    return div;
}