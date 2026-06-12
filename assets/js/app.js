import displayTitleAndMenu from "/assets/js/AppBase/TitleAndMenu.js";
import displayVendorList, { displayAddVendor } from "/assets/js/sections/vendors/vendor_list.js";
import displayVendor from "/assets/js/sections/vendors/vendors.js";

// This variable needs to be available globally within this
let main;

window.addEventListener('pywebviewready', async () =>{
    main = await displayTitleAndMenu();
    document.body.prepend(main);
    main.mainMenu.addEventListener('itemselect', (e) => {
        navigate(e.detail.location);
    });
});

async function navigate(location){
    main.clearBody();
    switch(location.toLowerCase()){
        case "main":
            break;
        case "vendors":
            const vendList = await displayVendorList();
            vendList.addEventListener('vendorselected', async(e) => {
                main.removeElement();
                main.appendElement(await displayVendor(e.detail));
            });
            const vendAdd = await displayAddVendor(vendList);
            main.appendElements(vendList, vendAdd);
            break;
        case "systems":
            break;
        case "tasks":
            break;
        case "staff":
            break;
    }
}
