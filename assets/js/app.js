import displayTitleAndMenu from "/assets/js/AppBase/TitleAndMenu.js";
import displayVendorList, { displayAddVendor } from "/assets/js/sections/vendors/vendor_list.js";
import displayVendor from "/assets/js/sections/vendors/vendors.js";
import displayVendorContacts from "/assets/js/sections/vendors/contacts.js";
import displayProductsWindow from "/assets/js/sections/vendors/products.js";
import displayNotesWindow from "/assets/js/sections/vendors/notes.js";
//import displayInvoiceWindow from "/assets/js/sections/vendors/invoices.js";

// This variable needs to be available globally within this
let main;

window.addEventListener('pywebviewready', async () =>{
    main = await displayTitleAndMenu();
    document.body.prepend(main);
    main.mainMenu.addEventListener('itemselect', (e) => {
        navigate(e.detail.location);
    });
});

async function VendorNavigation(){
     const vendList = await displayVendorList();
            vendList.addEventListener('vendorselected', async(e) => {
                main.removeElement();
                main.appendElements(
                    await displayVendor(e.detail),
                    await displayVendorContacts(e.detail),
                    await displayProductsWindow(e.detail),
                    await displayInvoiceWindow(e.detail),
                    await displayNotesWindow(e.detail)
                );
            });
            const vendAdd = await displayAddVendor(vendList);

            main.appendElements(vendList, vendAdd);
}





async function navigate(location){
    main.clearBody();
    switch(location.toLowerCase()){
        case "main":
            break;
        case "vendors":
            await VendorNavigation();
            break;
        case "systems":
            break;
        case "tasks":
            break;
        case "staff":
            break;
    }
}

