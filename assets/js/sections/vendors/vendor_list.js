"use strict";
import displaySelectInput from "/assets/js/components/selectInput.js";
import displayButton from "/assets/js/components/button.js";
import displayWindow from "/assets/js/components/displayWindow.js";

export default async function displayVendorList(){
    let vendorList = await window.pywebview.api.vendor.get_all_vendors();

    const vendorSelect = displaySelectInput('Select a vendor',vendorList,'gs-select','vendor-list-2');
    const searchBtn = displayButton('Select','gs-btn', () => goToUrl(`/html/vendor/detail.html?id=${vendorSelect.select.value}`));

    const vendorWindow = displayWindow('select vendor', false,false);
    vendorWindow.winBody.append(vendorSelect, searchBtn);

    vendorWindow.refresh = async () => {
        vendorList = await window.pywebview.api.vendor.get_all_vendors();
        const newSelect = displaySelectInput('Select a vendor',vendorList,'gs-select','vendor-list-2');
        vendorSelect.replaceWith(newSelect.select.parentElement ?? newSelect);
    }
    return vendorWindow;
}

export async function displayAddVendor(){
    const addWindow = await displayWindow('Add Vendor', true);
    const nameField = await displayField('Name', 'vendor-name', 'text', 'gs-input');
    const add1Field = await displayField('Add 1', 'vendor-add1', 'text', 'gs-input');
    const add2Field = await displayField('Add 2', 'vendor-add2', 'text', 'gs-input');
    const cityField = await displayField('city', 'vendor-city', 'text', 'gs-input');
    const stateField = await displayField('state', 'vendor-state', 'text', 'gs-input');
    const zipField = await displayField('Zip', 'vendor-zip', 'text', 'gs-input');
    const countryField = await displayField('country', 'vendor-country', 'text', 'gs-input');
    const websiteField = await displayField('website', 'vendor-website', 'text', 'gs-input');

    const line2 = await displayTwoField([add1Field, add2Field]);
    const line3 = await displayThreeFields([cityField, stateField, zipField]);
    const line4 = await displayTwoField([countryField, websiteField]);
    const line5 = displayButton('Add', ['gs-btn','gs-btn--primary'], () => {
        if(addVendor(nameField.input.value, add1Field.input.value, add2Field.input.value,
            cityField.input.value, stateField.input.value, zipField.input.value, countryField.input.value,
            websiteField.input.value))
        {
            nameField.input.value = '';
            add1Field.input.value = '';
            add2Field.input.value = '';
            cityField.input.value = '';
            stateField.input.value = '';
            zipField.input.value = '';
            countryField.input.value = '';
            websiteField.input.value = '';
        }

    });
    addWindow.winBody.append(nameField, line2, line3, line4, line5);
    return addWindow;
}