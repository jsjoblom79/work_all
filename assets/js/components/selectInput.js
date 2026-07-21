"use strict";

export default function displaySelectInput(options, id, event = null, name=null){
    const div = document.createElement('div');
    div.classList.add('gs-field');

    const select = document.createElement('select');
    select.classList.add('gs-select');
    select.id = id;
    let label;
    if(name !== null){
        label = document.createElement('label');
        label.for = id;
        label.textContent = name;
    }
    //verify options are arrays

    const defaultOption = options.map(opt => opt.id === '-1');
    const selOption = {textContent: 'Select an option to continue', value:'-1'};

        if (Array.isArray(options)) {
            const firstOpt = document.createElement('option');
            if(defaultOption !== null){
                firstOpt.textContent = defaultOption.textContent;
                firstOpt.value = defaultOption.value;
                select.append(firstOpt);
            }


            for (const option of options) {

                const opt = document.createElement('option');
                opt.selected = !!option.select;
                opt.textContent = option.name;
                opt.value = option.id;


                select.append(opt);
            }
        } else {
            const noOption = document.createElement('option');
            noOption.textContent = 'Add an option to continue';
            noOption.value = '-1';
            select.append(noOption);
        }

    if(event){
       select.addEventListener('change', event);
    }
    if(name !== null){
        div.append(label, select);
    } else {
        div.append(select);
    }

    div.select = select;
    return div;
}

export function selectOption(text, value=null){
    const option = document.createElement('option');
    option.textContent = text;
    if(value !== null){
        option.value = value;
    } else {
        option.value = text;
    }
    return option;
}