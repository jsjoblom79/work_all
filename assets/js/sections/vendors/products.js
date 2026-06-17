"use strict";

import displayWindow from "/assets/js/components/displayWindow.js";
import displayTables from "/assets/js/components/tableDisplay.js";
import displayField from "/assets/js/components/inputField.js";
import displayTwoFields, { displayThreeFields } from "/assets/js/components/displayMultipleFields.js";
import displayButton from "/assets/js/components/button.js";
import displayAlert from "/assets/js/components/alertMessage.js";

// Global function variables. These allow each function to talk to each other
let productListWin;
let productAddUpdateWin;

export default async function displayProductsWindow(vendorId)  {

    const mainWin = await displayWindow('Products', true, true);

    const prodList = await displayProductList(vendorId);
    const productDetail = await displayProductAddUpdate(vendorId);

    mainWin.winBody.append(prodList, productDetail);
    return mainWin;
}

export async function displayProductList(vendorId){
    const listWin = displayWindow('Products', true, false);
    const products = await window.pywebview.api.vendor.get_all_products(vendorId);
    const tableFields = ['name', 'description', 'is_used', 'create_date'];
    const productTable = await displayTables('products',tableFields,products);

    listWin.winBody.append(productTable);
    return listWin;
}

export async function displayProductAddUpdate(vendorId = null){
    const detailWin = displayWindow('Product Detail');

    return detailWin;
}