"use strict";

import displayWindow from "/assets/js/components/displayWindow.js";
import displayTables from "/assets/js/components/tableDisplay.js";
import displayField from "/assets/js/components/inputField.js";
import displayTwoFields, { displayThreeFields } from "/assets/js/components/displayMultipleFields.js";
import displayButton from "/assets/js/components/button.js";
import displayAlert from "/assets/js/components/alertMessage.js";
import {returnISODate} from "/assets/js/helper/helper_functions.js";

// Global function variables. These allow each function to talk to each other
let productListWin;
let productAddUpdateWin;

export default async function displayProductsWindow(vendorId)  {

    const mainWin = await displayWindow('Products', true, true);

    productListWin = await displayProductList(vendorId);
    productAddUpdateWin = await displayProductAddUpdate(vendorId);

    mainWin.winBody.append(productListWin, productAddUpdateWin);
    return mainWin;
}

export async function displayProductList(vendorId){
    const listWin = displayWindow('Products List', true, false);
    const products = await window.pywebview.api.vendor.get_all_products(vendorId);
    const tableFields = ['Name', 'Description', 'In Use', 'Price', 'Created'];
    const tableFilterFields = ['name', 'description', 'is_used','price', 'create_date'];
    const productTable = await displayTables('products',tableFields,products,tableFilterFields);

    productTable.addEventListener('rowselect', (e) => {
        productAddUpdateWin.updateProduct(e.detail);
    });

    listWin.winBody.append(productTable);
    listWin.refresh = async() => {
        const products = await window.pywebview.api.vendor.get_all_products(vendorId);
        productTable.refresh(products);
    };
    return listWin;
}

export async function displayProductAddUpdate(vendorId = null){
    let product;
    const detailWin = displayWindow('Product Detail');
    const productName = await displayField('Name', 'product-name', 'text');
    const productDescription = await displayField('Description', 'product-description', 'text');
    const productModel = await displayField('Model', 'product-model', 'text');
    const productSerial =  await displayField('Serial', 'product-serial', 'text');
    const productItemNumber = await displayField('Item Number', 'product-item_number', 'text');
    const productServiceLevel = await displayField('Service Level', 'product-service_level', 'text');
    const productCreateDate = await displayField('Create Date', 'product-create_date', 'date');
    const productUpdateDate = await displayField('Last Updated', 'product-update_date', 'date');
    const productIsUsed = await displayField('Currently Used', 'product-is_used', 'checkbox');
    const productPrice = await displayField('Price', 'product-price', 'text');

    const line1 = displayTwoFields([productName, productDescription]);
    const line2 = displayThreeFields([productItemNumber, productModel, productSerial]);
    const line3 = displayThreeFields([productServiceLevel, productIsUsed, productPrice]);
    const line4 = displayTwoFields([productCreateDate, productUpdateDate]);

    const fields = [productName, productDescription, productModel, productSerial, productIsUsed, productServiceLevel, productItemNumber, productPrice]

    const addBtn = displayButton('Add', ['gs-btn', 'gs-btn--primary'], async() => {
        const newProduct = {};
        fields.forEach(field => {
           const key = field.input.id.replace('product-','');
           newProduct[key] = field.input.value;
           if(key.includes('used')){
               newProduct[key] = !!field.input.checked;
           }
        });
        newProduct['vendor_id'] = vendorId;

        const results = await window.pywebview.api.vendor.add_product(newProduct);

        if(results.result){
            detailWin.prepend(await displayAlert(`${results.product['name']} was successfully added. `, 'success'));
            productListWin.refresh();
            clearProduct();
        } else {
            detailWin.prepend(await displayAlert('Product was not added. ', 'error'));
        }
    });

    const updateBtn = displayButton('Update', ['gs-btn', 'gs-btn--primary'], async() =>{
        fields.forEach(field => {
           const key = field.input.id.replace('product-','');
           product[key] = field.input.value;
           if(key.includes('used')){
               product[key] = !!field.input.checked;
           }

        });

        const results = await window.pywebview.api.vendor.update_product(product);
        if(results.result){
            detailWin.prepend(await displayAlert(`${results.product['name']} was successfully update. `, 'success'));
            productListWin.refresh();
            clearProduct();
        } else {
            detailWin.prepend(await displayAlert('The product was not updated. ', 'error'));
        }
    });

    const clearProduct = () => {
        fields.forEach(field => {
            field.input.value = null;
            if(field.input.checked){
                field.input.checked = false;
            }
        });
        productCreateDate.input.value = null;
        productUpdateDate.input.value = null;
    };

    detailWin.updateProduct = (prod) => {
        product = prod;
        if(product !== null) {
            fields.forEach(field => {
                const key = field.input.id.replace('product-', '');
                field.input.value = product[key];
                if (key.includes('used')) {
                    field.input.checked = !!product[key];
                }
                console.log(product['price']);
                productCreateDate.input.value = returnISODate(product['create_date']);
                detailWin.removeContent(addBtn);
                detailWin.addContent(updateBtn);
                detailWin.setTitle(`Update ${product.name}`);
            });
        } else {
            clearProduct();
            detailWin.removeContent(updateBtn);
            detailWin.addContent(addBtn);
            detailWin.setTitle('Add Product');
        }
    }
    detailWin.winBody.append(line1, line2, line3, line4, addBtn);
    return detailWin;
}