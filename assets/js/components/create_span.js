"use strict";


export default function displaySpan(content, classList){
    const span = document.createElement('span');
    span.classList.add(classList);
    span.textContent = content;
    return span;
}