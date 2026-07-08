"use strict";

export default function displayText(text, headerSize=null){
    const div = document.createElement('div');
    let header;
    if(headerSize !== null) {
       header = document.createElement(headerSize);
       header.textContent = text;
       div.append(header);
    } else {
        div.textContent = text;
    }
    div.setText = (text) => { header.textContent = text; };
    return div;
}