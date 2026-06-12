"use strict";

import displayButton from "/assets/js/components/button.js";
import displayField from "/assets/js/components/inputField.js";
import displaySelectInput from "/assets/js/components/selectInput.js";
import displayWindow from "/assets/js/components/displayWindow.js";
import displayTwoField from "/assets/js/components/displayTwoField.js";
import displayThreeFields from "/assets/js/components/displayThreeFields.js";
import displayAlert from "/assets/js/components/alertMessage.js";
import returnDate from "/assets/js/helper/helper_functions.js";

export default async function displayVendor(vendorId){
    const vendor = await window.pywebview.api.vendor.get_vendor(vendorId);
    const vendorWindow = displayWindow('Company Information', true);
    if(vendor !== null){
        console.log(vendor);
        vendorWindow.setTitle(vendor.name + ' Company Information');
        const nameField = await displayField('Name', 'vendor-name', 'text', 'gs-input',vendor.name);
        const add1Field = await displayField('Add 1', 'vendor-address1', 'text', 'gs-input',vendor.address1);
        const add2Field = await displayField('Add 2', 'vendor-address2', 'text', 'gs-input',vendor.address2);
        const cityField = await displayField('City', 'vendor-city', 'text', 'gs-input',vendor.city);
        const stateField = await displayField('State', 'vendor-state', 'text', 'gs-input', vendor.state);
        const zipField = await displayField('Zip', 'vendor-zip', 'text', 'gs-input', vendor.zip);
        const countryField = await displayField('Country', 'vendor-country', 'text', 'gs-input',vendor.country);
        const websiteField = await displayField('Website', 'vendor-website', 'text', 'gs-input',vendor.website);
        const cdField = await displayField('Created','vendor-create_date','date','gs-input',returnDate(vendor.create_date));
        const udField = await displayField('Last Updated', 'vendor-modify_date', 'date', 'gs-input', returnDate(vendor.modify_date));

        const vendorFields = [nameField, add1Field, add2Field, cityField, stateField, zipField, countryField, websiteField];
        const updateButton = displayButton('Update',['gs-btn','gs-btn--primary'], async() => {
            const updatedVendor = {};
            vendorFields.forEach(field => {
                const key = field.input.id.replace('vendor-','');
                console.log(key);
                updatedVendor[key] = field.input.value;
            });

            const results = window.pywebview.api.vendor.update_vendor(updatedVendor);
            if(results.result){
                vendorWindow.winBody.prepend(await displayAlert('Vendor successfully updated. ', 'success'));
                udField.input.value = returnDate(results.vendor.modify_date);
            } else {
                vendorWindow.winBody.prepend(await displayAlert('Vendor update failed. ', 'error'));
            }
        });

        const line2 = await displayTwoField([add1Field, add2Field]);
        const line3 = await displayThreeFields([cityField, stateField, zipField]);
        const line4 = await displayTwoField([countryField, websiteField]);
        const line5 = await displayThreeFields([updateButton, cdField, udField]);

        vendorWindow.winBody.append(nameField, line2, line3, line4, line5);
        return vendorWindow;
    }
    return
}


