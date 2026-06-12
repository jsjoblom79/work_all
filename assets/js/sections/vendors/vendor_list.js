"use strict";
import displaySelectInput from "/assets/js/components/selectInput.js";
import displayButton from "/assets/js/components/button.js";
import displayWindow from "/assets/js/components/displayWindow.js";
import displayField from "/assets/js/components/inputField.js";
import displayTwoField from "/assets/js/components/displayTwoField.js";
import displayThreeFields from "/assets/js/components/displayThreeFields.js";
import displayAlert from "/assets/js/components/alertMessage.js";

export default async function displayVendorList(){
    let vendorList = await window.pywebview.api.vendor.get_all_vendors();

    const vendorSelect = displaySelectInput('Select a vendor',vendorList,'gs-select','vendor-list-2');


    const vendorWindow = displayWindow('select vendor', false,false);
    const searchBtn = displayButton('Select','gs-btn', () => {
        vendorWindow.dispatchEvent(new CustomEvent('vendorselected', { detail: vendorSelect.select.value }));
    });
    vendorWindow.winBody.append(vendorSelect, searchBtn);

    vendorWindow.refresh = async () => {
        vendorList = await window.pywebview.api.vendor.get_all_vendors();
        const newSelect = displaySelectInput('Select a vendor',vendorList,'gs-select','vendor-list-2');
        vendorSelect.replaceWith(newSelect.select.parentElement ?? newSelect);
    }

    return vendorWindow;
}

export async function displayAddVendor(vendorSelect){
    const addWindow = await displayWindow('Add Vendor', true);
    const nameField = await displayField('Name', 'vendor-name', 'text', 'gs-input');
    const add1Field = await displayField('Add 1', 'vendor-address1', 'text', 'gs-input');
    const add2Field = await displayField('Add 2', 'vendor-address2', 'text', 'gs-input');
    const cityField = await displayField('city', 'vendor-city', 'text', 'gs-input');
    const stateField = await displayField('state', 'vendor-state', 'text', 'gs-input');
    const zipField = await displayField('Zip', 'vendor-zip', 'text', 'gs-input');
    const countryField = await displayField('country', 'vendor-country', 'text', 'gs-input');
    const websiteField = await displayField('website', 'vendor-website', 'text', 'gs-input');

    const line2 = await displayTwoField([add1Field, add2Field]);
    const line3 = await displayThreeFields([cityField, stateField, zipField]);
    const line4 = await displayTwoField([countryField, websiteField]);
    const vendorFields = [nameField, add1Field, add2Field, cityField, stateField, zipField, countryField, websiteField ];
    const line5 = displayButton('Add', ['gs-btn','gs-btn--primary'], async() => {
        const newVend = {}
        vendorFields.forEach(field =>{
           const key = field.input.id.replace('vendor-','');
           newVend[key] = field.input.value;
        });
        const vendResult = await window.pywebview.api.vendor.add_vendor(newVend);
        if(vendResult.result){
            addWindow.winBody.prepend(await displayAlert('Vendor Successfully Added. ', 'success'));
            clearVendorFields();
            vendorSelect.refresh();
        } else {
            addWindow.winBody.prepend(await displayAlert('Vendor was not added. ', 'error'));
        }
    });

    const clearVendorFields = () => {
      vendorFields.forEach(field => {
          field.input.value = null;
      });
    };

    addWindow.winBody.append(nameField, line2, line3, line4, line5);
    return addWindow;
}