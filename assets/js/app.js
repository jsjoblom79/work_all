import displayTitleAndMenu from "/assets/js/AppBase/TitleAndMenu.js";
import displayVendorList, { displayAddVendor } from "/assets/js/sections/vendors/vendor_list.js";

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
            main.appendElement(await displayVendorList(), await displayAddVendor());
            break;
        case "systems":
            break;
        case "tasks":
            break;
        case "staff":
            break;
    }
}
