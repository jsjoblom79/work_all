"use strict";

import displayButton from "/assets/js/components/button.js";
import displayField from "/assets/js/components/inputField.js";
import displaySelectInput from "/assets/js/components/selectInput.js";
import displayWindow from "/assets/js/components/displayWindow.js";
import displayTwoField from "/assets/js/components/displayTwoField.js";
import displayThreeFields from "/assets/js/components/displayThreeFields.js";
import displayAlert from "/assets/js/components/alertMessage.js";

export default async function displayVendorSelect(){
    const div = document.createElement('div');
    div.textContent = "Vendors";
    return div;
}