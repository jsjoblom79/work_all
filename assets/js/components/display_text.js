"use strict";

export default function displayText(text, headerSize=null){
    const div = document.createElement('div');
    if(headerSize !== null) {
       const header = document.createElement(headerSize);
       header.textContent = text;
       div.append(header);
    } else {
        div.textContent = text;
    }

    return div;
}