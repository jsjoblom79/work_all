"use strict";

export default function displayTwoFields(fields){
    if(Array.isArray(fields)){
        const div = document.createElement('div');
        div.classList.add('gs-fields-2');

        for(const field of fields){
            div.append(field);
        }
        return div;
    }
    return null;
}

export function displayThreeFields(fields){
    if(Array.isArray(fields)){
        const div = document.createElement('div');
        div.classList.add('gs-fields-3');

        for(const field of fields){
            div.append(field);
        }
        return div;
    }
    return null;
}