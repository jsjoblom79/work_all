"use strict";




import displayWindow from "/assets/js/components/displayWindow.js";
import displayField from "/assets/js/components/inputField.js";
import displaySelectInput from "/assets/js/components/selectInput.js";
import {displayThreeFields} from "/assets/js/components/displayMultipleFields.js";
import displayTables from "/assets/js/components/tableDisplay.js";
import displayButton from "/assets/js/components/button.js";
import displayAlert from "/assets/js/components/alertMessage.js";
import {returnISODate} from "/assets/js/helper/helper_functions.js";

let invoiceListWindow;
let invoiceAddWindow;


export default async function displayInvoiceWindow(vendorId){
    const mainWindow = displayWindow('Invoices');
    invoiceListWindow = await displayInvoiceList(vendorId);
    invoiceAddWindow = await displayInvoiceAdd(vendorId);

    mainWindow.winBody.append(invoiceListWindow, invoiceAddWindow);
    return mainWindow;
}

export async function displayInvoiceList(vendorId){
    invoiceListWindow = displayWindow('Past Invoices');
    const invoices = await window.pywebview.api.vendor.get_all_invoices(vendorId);
    const invoiceListTable = await displayTables(
        'vendor-invoice-list',
        ['Invoice Number', 'Due Date', 'Total'],
        invoices,
        ['invoice_number', 'due_date', 'invoice_total']
    )
    invoiceListWindow.winBody.append(invoiceListTable);
    invoiceListTable.addEventListener('rowselect', (e) => {
           invoiceAddWindow.loadAccounts(e.detail);
    });

    return invoiceListWindow
}
export async function displayInvoiceAdd(vendorId){
    let invoice;
    invoiceAddWindow = displayWindow('Add Invoice');
    const products = await window.pywebview.api.vendor.get_all_products(vendorId);
    const invoiceNumberField = await displayField('Invoice Number','invoice-invoice_number','text');
    const invoiceReceivedDateField = await displayField('Received Date', 'invoice-received_date', 'date');
    const invoiceDueDateField = await displayField('Due Date', 'invoice-due_date', 'date');
    const invoiceTotalField = await displayField('Total Due', 'invoice-invoice_total', 'text');
    const invoicePaidField = await displayField('Paid','invoice-paid','checkbox');
    const fieldList = [invoiceNumberField, invoiceReceivedDateField, invoiceDueDateField, invoiceTotalField, invoicePaidField];
    const invoiceProductListTable = await displayTables('invoice-product_list',['Name', 'Description', 'Price', 'edit'],[],['name','description', 'price', 'edit']);
    const invoiceProductSelectField = await displaySelectInput(products,'invoice-products', async () => {
        const productId = invoiceProductSelectField.select.value;
        const product = await window.pywebview.api.vendor.get_product_by_id(productId);
        if(product !== null){
            invoiceProductListTable.addRow(product);
            invoiceProductSelectField.select.value = -1;
        }
    },'Products');

    const addBtn = displayButton('Add',     'gs-btn--primary', async() =>{
        //Start by adding the invoice so we can get an invoice id.
        let newInvoice = {};
        fieldList.forEach(field => {
            const key = field.input.id.replace('invoice-','');
            if(key.includes('paid')){
                newInvoice[key] = !!field.input.checked;
            } else {
                newInvoice[key] = field.input.value;
            }

        });
        newInvoice['vendor_id'] = vendorId;
        const result = await window.pywebview.api.vendor.add_invoice(newInvoice);
        let itemResults;
        if(result.result){
           const items = invoiceProductListTable.getData()
               for(const item of items){
               const newInvoiceItem = {
                   invoice_id: result.invoice['id'],
                   product_id: item.id
               };
               itemResults = await window.pywebview.api.vendor.add_invoice_item(newInvoiceItem);
           }
        }

        if(itemResults.result){
            invoiceAddWindow.winBody.prepend(displayAlert('Invoice Successfully Added. ', 'success'));
            clearInvoice();
        } else {
            invoiceAddWindow.winBody.prepend(displayAlert('There was an error trying to add your invoice. ', 'error'));
        }

    });

    const line1 = displayThreeFields([invoiceNumberField,invoiceReceivedDateField, invoiceDueDateField]);
    const line2 = displayThreeFields([invoiceTotalField, invoiceProductSelectField, invoicePaidField]);

    const updateBtn = displayButton('Update', 'gs-btn--primary',async() => {
        if(invoice !==  null){
            fieldList.forEach(field => {
                const key = field.input.id.replace('invoice-','');
                if(key.includes('paid')){
                    invoice[key] = !!field.input.checked;
                } else {
                   invoice[key] = field.input.value
                }
            });
            const currentItems = await window.pywebview.api.vendor.get_all_invoice_items(invoice.id);
            const newItems = invoiceProductListTable.getData();
            const removeItems = currentItems.filter(curItem => !newItems.some(nItem => nItem.id === curItem.id));
            const addItems = newItems.filter(nItem => !currentItems.some(curItem => curItem.id === nItem.id));

            for(const item of removeItems){
                console.log(item);
                const result = await window.pywebview.api.vendor.delete_invoice_item(invoice.id, item.id);
                if(result.result){
                    invoiceAddWindow.winBody.prepend(displayAlert(`${item.name} has been removed. `, 'success'));
                } else {
                    invoiceAddWindow.winBody.prepend(displayAlert(`${item.name} was not removed. `, 'error'));
                }
            }
            for(const item of addItems){
                const newItem = {
                    invoice_id: invoice.id,
                    product_id: item.id
                }
                const result = await window.pywebview.api.vendor.add_invoice_item(newItem);
                if(result.result){
                    invoiceAddWindow.winBody.prepend(displayAlert(`${item.name} has been added. `, 'success'));
                } else {
                    invoiceAddWindow.winBody.prepend(displayAlert(`${item.name} was not added. `, 'error'));
                }
            }


        }
    });


    const clearInvoice = () => {
        fieldList.forEach(field => {
            if(field.input.id.includes('paid')){
                field.input.checked = false;
            } else {
              field.input.value = null;
            }
        });
        invoiceProductListTable.clearData();
    }
    invoiceAddWindow.winBody.append(line1, line2,addBtn, invoiceProductListTable);
    invoiceAddWindow.loadAccounts = async(inv) => {
        invoice = inv
        if(invoice !== null){
            invoiceProductListTable.clearData();
            fieldList.forEach(field => {
            const key = field.input.id.replace('invoice-','');
            if(key.includes('date')){
                field.input.value = returnISODate(invoice[key]);
            } else if(key.includes('paid')){
                field.input.checked = !!invoice[key];
            } else {
                field.input.value = invoice[key];
            }
            });
            const products = await window.pywebview.api.vendor.get_all_invoice_items(invoice.id);

            products.forEach(product => {
                invoiceProductListTable.addRow(product);
            })
            invoiceAddWindow.setTitle(`Invoice Number: ${invoice.invoice_number}`);
            invoiceAddWindow.removeContent(addBtn);
            invoiceAddWindow.addContent(updateBtn);
        } else {
            clearInvoice();
            invoiceAddWindow.setTitle('Add Invoice');
            invoiceAddWindow.removeContent(updateBtn);
            invoiceAddWindow.addContent(addBtn);
        }

    };
    return invoiceAddWindow;
}
