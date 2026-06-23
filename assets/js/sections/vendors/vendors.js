"use strict";

import displayButton from "/assets/js/components/button.js";
import displayField from "/assets/js/components/inputField.js";
import displayWindow from "/assets/js/components/displayWindow.js";
import displayTwoField from "/assets/js/components/displayTwoField.js";
import displayThreeFields from "/assets/js/components/displayThreeFields.js";
import displayAlert from "/assets/js/components/alertMessage.js";
import { returnISODate } from "/assets/js/helper/helper_functions.js";

export default async function displayVendor(vendorId){
    const vendor = await window.pywebview.api.vendor.get_vendor(vendorId);
    const vendorWindow = displayWindow('Company Information', true);
    if(vendor !== null){
        vendorWindow.setTitle(vendor.name + ' Company Information');
        const nameField = await displayField('Name', 'vendor-name', 'text', vendor.name);
        const add1Field = await displayField('Add 1', 'vendor-address1', 'text', vendor.address1);
        const add2Field = await displayField('Add 2', 'vendor-address2', 'text', vendor.address2);
        const cityField = await displayField('City', 'vendor-city', 'text', vendor.city);
        const stateField = await displayField('State', 'vendor-state', 'text',  vendor.state);
        const zipField = await displayField('Zip', 'vendor-zip', 'text',  vendor.zip);
        const countryField = await displayField('Country', 'vendor-country', 'text', vendor.country);
        const websiteField = await displayField('Website', 'vendor-website', 'text', vendor.website);
        const cdField = await displayField('Created','vendor-create_date','date',returnISODate(vendor.create_date));
        const udField = await displayField('Last Updated', 'vendor-modify_date', 'date',  returnISODate(vendor.modify_date));

        const vendorFields = [nameField, add1Field, add2Field, cityField, stateField, zipField, countryField, websiteField];
        const updateButton = displayButton('Update',['gs-btn--primary'], async() => {
            vendorFields.forEach(field => {
                const key = field.input.id.replace('vendor-','');
                vendor[key] = field.input.value;
            });
            vendor.create_date = new Date(vendor.create_date).toISOString();
            const results = await window.pywebview.api.vendor.update_vendor(vendor);
            console.log(results);
            if(results.result){
                vendorWindow.winBody.prepend(await displayAlert('Vendor successfully updated. ', 'success'));
                udField.input.value = returnISODate(results.vendor.modify_date);
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


