const apiURL = "http://localhost:5678/api/works";

let globalProjectsData = [];
let categoryToIdMap = {};
const gallery = document.querySelector(".gallery");
const portfolio = document.getElementById("portfolio");
const divFilters = document.createElement("div");
divFilters.classList.add("filters");
portfolio.appendChild(divFilters);
portfolio.insertBefore(divFilters, gallery);

function getProjects() {
   fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        globalProjectsData = data;
        createCategoryToIdMap(data);
        createFilterButtons();
        showProjects(data);
        showProjectsInModal();
    }) 
}

function createCategoryToIdMap(data) {
    data.forEach(project => {
        if (!categoryToIdMap[project.category.name]) {
            categoryToIdMap[project.category.name] = project.category.id;
        }
    });
}
function createFilterButtons() {
    const uniqueCategoryNames = [...new Set(globalProjectsData.map(item => item.category.name))];
    createButton("Tous", showAllProjects, divFilters);

    uniqueCategoryNames.forEach(categoryName => {
        createButton(categoryName, () => filterItems(categoryName), divFilters);
    });
}

function createButton(text, eventListener, container){
    const button = document.createElement('button');
    button.innerText = text;
    button.classList.add("filterBtn");
    button.addEventListener('click', eventListener);
    container.appendChild(button);
}

function adjustTitle(title){
    const corrections = {
        "Hotels & restaurants": "Hôtels & restaurants",
        "Abajour Tahina": "Abat-jour Tahina",
        "Villa “La Balisiere” - Port Louis": "Villa “La Balisière” - Port-Louis",
        "Hotel First Arte - New Delhi": "Hôtel First Arte - New Delhi"
    };
    return corrections [title] || title;
}
function showProjects(data) {
    gallery.innerHTML = "";
    data.forEach(project => {
        const projectElement = createProjectElement(project);
        gallery.appendChild(projectElement);
})}

function createProjectElement(project){
    const projectElement = document.createElement("figure");
    projectElement.className = "project";
    const adjustedTitle = adjustTitle(project.title);
    projectElement.innerHTML = `<img src="${project.imageUrl}" alt="${project.title}">
                                <h3>${adjustedTitle}</h3>`;
    return projectElement;
}
function showAllProjects(){
    showProjects(globalProjectsData);
}
function filterItems(categoryName) {
    const categoryId = categoryToIdMap[categoryName];
    const filteredProjects = globalProjectsData.filter(project => project.categoryId === categoryId);
    showProjects(filteredProjects);
}

getProjects();


                                        /////////////////////////////////////////////////
                                        //////////// JavaScript pour l'admin ////////////
                                        /////////////////////////////////////////////////

//Stockage du token //
const storedToken = localStorage.getItem('token');
let textSpan = document.createElement('span');
let textSpanLink = document.createElement('a');

//Condition d'afficher les différents éléments admin en fonction de si on est connecté ou non //
if (storedToken === 'eyJhbGciOiJIeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4UzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4'){
    // Création de la bannière d'édition //
    let banner = document.createElement("div");
    banner.classList.add("banner");
    document.body.appendChild(banner);

    const header = document.querySelector('header');
    if (header) {
        header.insertAdjacentElement('beforebegin', banner);
    }

    let bannerIcon = document.createElement("i");
    bannerIcon.className = "fa-regular fa-pen-to-square";
    banner.appendChild(bannerIcon);

    let bannerPrg = document.createElement("p");
    bannerPrg.classList.add("bannerPrg");
    bannerPrg.innerHTML = "Mode édition";
    banner.appendChild(bannerPrg);

    // Modification du bouton logIN en logOUT //
    let logOutBtn = document.getElementById("logout")
    logOutBtn.innerText = "logout";
    logOutBtn.addEventListener('click',  ()=> {
        localStorage.removeItem('token')
        location.reload() 
    })

    // Désactivation des filtres //
    let filters = document.querySelector(".filters");
    filters.style.display = 'none';

    // Création du lien vers la modale "modifier" et de son icône près du h2 mes projets //
    let icon = document.createElement('i');
    icon.className = "fa-regular fa-pen-to-square"

    let modifPrg = document.createElement('p');
    modifPrg.appendChild(icon);

    textSpanLink.href = '#';
    textSpanLink.id = 'editLink';
    textSpanLink.textContent = "modifier";
    textSpanLink.addEventListener('click', openModal);

    modifPrg.appendChild(textSpanLink);

    let myProjects = document.querySelector("#portfolio h2");
    let divMyProjects = document.createElement('div');
    divMyProjects.className = "divMyProjects";
    divMyProjects.appendChild(myProjects)
    divMyProjects.appendChild(modifPrg);

    if(storedToken) {
        myProjects.style.marginBottom  = "0px";
    }

    portfolio.appendChild(divMyProjects);
    portfolio.insertBefore(divMyProjects, filters);

}
                                        ///////////////////////////////////////////////////
                                        //////////// Javascript pour la modale ////////////
                                        ///////////////////////////////////////////////////

const galleryModal = document.querySelector(".modalContent");
const focusableSelector = "button, a, input, textarea, .fa-xmark, .fa-trash-can, .fa-arrow-left, .fa-chevron-down";
let focusables = [];
let previouslyFocusedElement = null;

// Fonction qui récupère les projets de l'API //
function showProjectsInModal(){
    globalProjectsData.forEach(project => {
        const projectElementModal = createProjectElementModal(project);
        document.querySelector(".modalContent").appendChild(projectElementModal);
    });
}

// Fonction qui ouvre la modale //
function openModal () {
    let modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        modal.setAttribute('aria-modal', 'true');
        localStorage.setItem('modalOpen', 'true');
        document.getElementById("modal-wrapper-PictureAdd").style.display = "none";
        focusables = Array.from(modal.querySelectorAll(focusableSelector));
        setTimeout(() => {
            if(focusables.length > 0) {
                focusables[0].focus();
            }
        }, 100);
        if(focusables.length > 0) {
            previouslyFocusedElement = document.activeElement;
            focusables[0].focus();
        } else {
            console.warn("Aucun élément focusable trouvé dans la modale");
        }
    } else {
        console.error("Élément modal introuvable");
    }
}

// Écouteur d'évènements qui attend que le contenu du DOM de la page soit entièrement chargé et
// prêt avant que le script puisse intéragir avec les éléments HTML //

    //Récupère la valeur de modalOpen depuis le localStorage//
    let modalOpen = localStorage.getItem('modalOpen');
    if (modalOpen === 'true') {
        openModal();
    }
    function closeModal () {
        let modal = document.getElementById("modal");
        const galleryEditModal = document.getElementById("modal-wrapper-GalleryEdit");
        const pictureAddModal = document.getElementById("modal-wrapper-PictureAdd");
        if (modal) {
            modal.style.display="none";
            modal.setAttribute('aria-hidden', 'true');
            modal.setAttribute('aria-modal', 'false');
            localStorage.removeItem('modalOpen');

            galleryEditModal.style.display = "flex";
            pictureAddModal.style.display = "none";

            if (previouslyFocusedElement !== null) {
                previouslyFocusedElement.focus()
            }
        }
    }

    // Îcones de fermeture //
    const exitIconGalleryEdit = document.getElementById("exitIconGalleryEdit");
    if (exitIconGalleryEdit) {
        exitIconGalleryEdit.addEventListener('click', closeModal);
    } else {
        console.error("Icône de sortie de la galerie introuvable")
    }
    const exitIconPictureAdd = document.getElementById("exitIconPictureAdd");
    if (exitIconPictureAdd) {
        exitIconPictureAdd.addEventListener('click', closeModal);
    } else {
        console.error("Icône de sortie de l'ajout de photo introuvable")
    }

    // Fermeture de la modale en cliquant sur le fond //
    window.addEventListener('click', function(event) {
        let modal = document.getElementById("modal");
        if(event.target === modal) {
            closeModal()
        }
    })
    // Empêche le retour en haut de page quand le lien est cliqué //
    let editLink = document.getElementById('editLink');
    if (editLink) {
        editLink.addEventListener('click', function(e){
            e.preventDefault();
        });
    } else {
        console.error("Lien d'édition introuvable")
    }

    // Fermeture de la modale par la touche Echap //
    window.addEventListener('keydown',  function(e){
        const modal = document.getElementById("modal");
        const isModalOpen = modal.style.display !== 'none' && modal.getAttribute('aria-hidden') === 'false';
        if(e.key === "Escape" || e.key === "Esc"){
            if (isModalOpen) {
             closeModal(e);   
            }
        };
        if(e.key === 'Tab' && isModalOpen){
            e.preventDefault();
            focusInModal(e, modal);
        };
    });

// Fonction qui va créer le format de chaque projet pour les afficher sur la page web //
function createProjectElementModal(project){
    const projectElementModal = document.createElement("figure");
    projectElementModal.className = "projectModal";
    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash-can";
    trashIcon.setAttribute('tabindex', '0');
    projectElementModal.innerHTML = `<img src="${project.imageUrl}" alt="${project.title}">`;
    projectElementModal.appendChild(trashIcon);
    return projectElementModal;
};

// Fonction qui va gérer le focus d'un élément (accessibilité) //
function focusInModal(e, modal) {
    let index = focusables.findIndex(f => f === document.activeElement); 
    if (e.shiftKey === true){
        index--;
    } else {
        index++;
    }
    if (index >= focusables.length){
        index = 0;
    }
    if (index < 0){
        index = focusables.length - 1;
    }
    focusables[index].focus();
}

// Fonction qui permet de changer de modale quand l'utilisateur clique sur le bouton "Ajouter une photo" //
document.addEventListener('DOMContentLoaded', function(){
    const addPictureBtn = document.getElementById("addPictureButton");
    if (addPictureBtn) {
        addPictureBtn.addEventListener('click', switchModal);
    } else {
        console.error("Bouton d'ajout de photo introuvable");
    }
});

        // Fonction qui va permettre de passer d'une modale à l'autre //
function switchModal() {
    const galleryEditModal = document.getElementById("modal-wrapper-GalleryEdit");
    const pictureAddModal = document.getElementById("modal-wrapper-PictureAdd");

    if (galleryEditModal.style.display === 'none'){

        galleryEditModal.style.display = 'flex';
        pictureAddModal.style.display = 'none';
        
        } else {
            galleryEditModal.style.display = 'none';
            pictureAddModal.style.display = 'flex';
        
        }
        updateModalAttributesAndFocus(galleryEditModal.style.display !== 'none' ? galleryEditModal : pictureAddModal, galleryEditModal.style.display !== 'none' ? 'modal-title' : 'modal-title-2');
}

function updateModalAttributesAndFocus(modalElement, ariaLabelledbyId){
    const modal = document.getElementById('modal');
    modal.setAttribute('aria-labelledby', ariaLabelledbyId);
    focusables = Array.from(modalElement.querySelectorAll(focusableSelector));
    if(focusables.length > 0){
            focusables[0].focus();
        } else {
            console.warn("Aucun élément focusable dans le modale de ajout de photos.");
        }
}

function getBack(){
    const getBackIcon = document.getElementById("getBackIcon");
    if (getBackIcon){
        getBackIcon.addEventListener('click', function(){
            const pictureAddModal = document.getElementById("modal-wrapper-PictureAdd");
            const galleryEditModal = document.getElementById("modal-wrapper-GalleryEdit");

            pictureAddModal.style.display = 'none';
            galleryEditModal.style.display = 'flex';

            galleryEditModal.setAttribute('aria-hidden', 'false');
            pictureAddModal.setAttribute('aria-hidden', 'true');
            const firstFocusableElement = galleryEditModal.querySelector(focusableSelector);
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
          });
        getBackIcon.addEventListener('keydown', function(e) {
        if (e.key === "Enter") {
                switchToGalleryEditModal();
            }
        });
    }
}
getBack();

function switchToGalleryEditModal() {
    const pictureAddModal = document.getElementById("modal-wrapper-PictureAdd");
    const galleryEditModal = document.getElementById("modal-wrapper-GalleryEdit");

    if(pictureAddModal && galleryEditModal) {
        pictureAddModal.style.display = 'none';
        galleryEditModal.style.display = 'flex';

        galleryEditModal.setAttribute('aria-hidden', 'false');
        pictureAddModal.setAttribute('aria-hidden', 'true');
        const firstFocusableElement = galleryEditModal.querySelector(focusableSelector);
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
    }
}

function setupCloseIconKeyListener() {
    const exitIcons = document.querySelectorAll(".fa-xmark");
    exitIcons.forEach(icon => {
        icon.addEventListener('keydown', function(e) {
            if (e.key === "Enter") {
                closeModal();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupCloseIconKeyListener();
});
