"use strict";

export default function displayPanel(title){
    const section = document.createElement('section');
    section.classList.add('gs-panel', 'gs-panel--bordered');
    const header = document.createElement('div')
    header.classList.add('gs-panel__header');
    header.textContent = title;

    section.append(header);

    return section;
}

export function displayIconGrid(){
    const div = document.createElement('div');
    div.classList.add('gs-icon-grid');

    div.addIcon = (icon) => {
        div.append(icon);
    };

    return div;
}

export function displayIcon(label, event, addtlClasses=null, image=null, glyph=null){
    const button = document.createElement('button');
    button.classList.add('gs-icon');

    // Add all classes to button.
    if(addtlClasses !== null){
        if(Array.isArray(addtlClasses)){
            addtlClasses.forEach(aClass => { button.classList.add(aClass); });
        } else {
            button.classList.add(addtlClasses);
        }
    }

    // Check for glyph or image.
    let img;
    if(image !== null){
        img = document.createElement('img');
        img.classList.add('gs-icon__img');
        img.src = image;
        button.append(img);
    }

    let glf;
    if(glyph !== null){
        glf = document.createElement('span');
        glf.classList.add('gs-icon__glyph');
        glf.textContent = glyph;
        button.append(glf);
    }

    // Add the button title
    const labelSpan = document.createElement('span');
    labelSpan.classList.add('gs-icon__label');
    labelSpan.textContent = label;

    button.append(labelSpan);

    // lastly add the event to the button
    button.addEventListener('click', event);

    return button;
}