"use strict";


import displayWindow from "/assets/js/components/displayWindow.js";
import displayTables from "/assets/js/components/tableDisplay.js";
import displayField from "/assets/js/components/inputField.js";
import displayTwoFields, { displayThreeFields } from "/assets/js/components/displayMultipleFields.js";
import displayButton from "/assets/js/components/button.js";
import displayAlert from "/assets/js/components/alertMessage.js";

let contactWin;
let contactTableWin;
let contactAddWin;

export default async function displayVendorContacts(vendorId){
    contactWin = await displayWindow('Contacts', true, true);
    contactTableWin = await displayContactTable(vendorId);
    contactAddWin = await displayAddContact(vendorId);
    contactWin.winBody.append(contactTableWin, contactAddWin);
    return contactWin;
}

export async function displayContactTable(vendorId){
    const contactTableWin = displayWindow('Valid Contacts',true);
    const contacts = await window.pywebview.api.vendor.get_all_contacts(vendorId);
    const contactTable = await displayTables(
        'vendor-contacts',
        ['Name', 'Phone', 'Email', 'Active'],
        contacts,
        ['fullname', 'phone', 'email', 'is_active']
    )
    contactTable.addEventListener('rowselect', (e) => {
        contactAddWin.updateContact(e.detail);
    });
    contactTableWin.winBody.append(contactTable);
    return contactTableWin;
}

export async function displayAddContact(vendorId = null, contact){
    const contactAddWin = displayWindow('Add Contact', true, true);
    const contactFname = await displayField('First Name', 'contact-first_name', 'text');
    const contactLname = await displayField('Last Name', 'contact-last_name', 'text');
    const contactPhone = await displayField('Phone', 'contact-phone', 'text');
    const contactEmail = await displayField('Email', 'contact-email', 'text');
    const contactTitle = await displayField('Title', 'contact-title', 'text');
    const contactActive = await displayField('Active', 'contact-is_active', 'checkbox');
    const contactLastUpdated = await displayField('Last Updated', 'contact-modify_date', 'date');

    const line1 = displayTwoFields([contactFname, contactLname]);
    const line2 = displayThreeFields([contactTitle, contactPhone, contactEmail]);
    const line3 = displayTwoFields([contactLastUpdated, contactActive]);

    const fields = [contactFname, contactLname, contactPhone, contactEmail, contactTitle, contactActive]
    const addContactBtn = displayButton('Add', ['gs-btn', 'gs-btn--primary'], async() =>{
        const newContact = {};
        fields.forEach(field => {
           const key = field.input.id.replace('contact-', '');
           newContact[key] = field.input.value;
           if(key.includes('active')){
               newContact[key] = !!field.input.checked;
           }
        });
        newContact['vendor_id'] = vendorId;
        const results = await window.pywebview.api.vendor.add_contact(newContact);
        if(results.result){
            contactAddWin.winBody.prepend(await displayAlert(`${results.contact['first_name']} was successfully added. `, 'success'));
        } else {
            contactAddWin.winBody.prepend(await displayAlert('Contact was not added. ', 'error'));
        }
    });

    contactAddWin.updateContact = (contact) => {
        fields.forEach(field => {
            const key = field.input.id.replace('contact-','');
            field.input.value = contact[key];
        });
    }
    contactAddWin.winBody.append(line1, line2, line3, addContactBtn);
    return contactAddWin;
}