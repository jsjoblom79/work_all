"use strict";

export default async function displayMainMenu() {
   const nav = document.createElement('nav');
    nav.classList.add('gs-mb-2');
    const ul = document.createElement('ul');
    ul.classList.add('gs-menubar', 'gs-mb-2');
    ul.id = 'gs-main-menubar';

    const menuItems = await window.pywebview.api.config.getUrls();
    if (menuItems.length > 0){
       for(const item of menuItems){
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.classList.add('gs-menubar__trigger');
            button.textContent = item.name;
            button.addEventListener('click', async () => {
                nav.dispatchEvent(new CustomEvent('itemselect', {detail: {location: item.name }}));
            });
            li.appendChild(button);
            ul.appendChild(li);
       }
       const ulli = document.createElement('li');
       const printBtn = document.createElement('button');
       printBtn.classList.add('gs-menubar__trigger');
       printBtn.textContent = 'Print';
       printBtn.addEventListener('click', async() => await window.pywebview.api.print_window());
       const exitBtn = document.createElement('button');
       exitBtn.classList.add('gs-menubar__trigger', 'gs-btn--danger');
       exitBtn.textContent = "EXIT";
       exitBtn.addEventListener('click', async() => await window.pywebview.api.close_app());
       ulli.appendChild(exitBtn);
       ul.append(printBtn, ulli);
       nav.appendChild(ul);
    }
    return nav;
}

window.goToUrl = function(url){
    location.assign(url);
}

