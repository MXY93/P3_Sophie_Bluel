const apiURL = "http://localhost:5678/api/works";

let globalProjectsData = [];
let categoryToIdMap = {};
const gallery = document.querySelector(".gallery");
const portfolio = document.getElementById("portfolio");
const divFilters = document.createElement("div");
divFilters.classList.add("filters");
portfolio.appendChild(divFilters);
portfolio.insertBefore(divFilters, gallery);

async function getProjects() {
   await fetch(apiURL)
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
document.addEventListener('DOMContentLoaded', function(){
    setupModalTriggers();
    checkAndOpenActiveModal();
});

function checkAndOpenActiveModal(){
   let activeModal = localStorage.getItem('activeModal');
        if (activeModal === 'modal-wrapper-GalleryEdit') {
            openModalWrapperGalleryEdit();
        } else if (activeModal === 'modal-wrapper-PictureAdd'){
            openModalWrapperPictureAdd();
        }
        function openModalWrapperGalleryEdit() {
            const galleryEditModal = document.getElementById("modal-wrapper-GalleryEdit");
            galleryEditModal.style.display = 'flex';
            document.getElementById("modal-wrapper-PictureAdd").style.display = "none";
            localStorage.setItem('activeModal', 'modal-wrapper-GalleryEdit');
            updateModalAttributesAndFocus(galleryEditModal, 'modal-title');
        }
        
        function openModalWrapperPictureAdd() {
            const pictureAddModal = document.getElementById("modal-wrapper-PictureAdd");
            pictureAddModal.style.display = 'flex';
            document.getElementById("modal-wrapper-GalleryEdit").style.display = "none";
            localStorage.setItem('activeModal', 'modal-wrapper-PictureAdd');
            updateModalAttributesAndFocus(pictureAddModal, 'modal-title-2');
        } 
}
    
    
    function closeModal () {
        let modal = document.getElementById("modal");
        const galleryEditModal = document.getElementById("modal-wrapper-GalleryEdit");
        const pictureAddModal = document.getElementById("modal-wrapper-PictureAdd");
        if (modal) {
            modal.style.display="none";
            modal.setAttribute('aria-hidden', 'true');
            modal.setAttribute('aria-modal', 'false');
            localStorage.removeItem('activeModal');

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
        exitIconPictureAdd.addEventListener('click', function() {
            closeModal();
            resetAddPicture();
        });
    } else {
        console.error("Icône de sortie de l'ajout de photo introuvable")
    }

    // Fermeture de la modale en cliquant sur le fond //
    window.addEventListener('click', function(event) {
        let modal = document.getElementById("modal");
        if(event.target === modal) {
            closeModal();
            resetAddPicture();
        }
    })
    // Empêche le retour en haut de page quand le lien est cliqué //
    function setupModalTriggers(){
        const editLink = document.getElementById('editLink');
        if (editLink) {
            editLink.addEventListener('click', function(e){
                e.preventDefault();
            });
        } else {
            console.error("Lien d'édition introuvable")
        }
        
    }
    

    // Fermeture de la modale par la touche Echap //
    window.addEventListener('keydown',  function(e){
        const modal = document.getElementById("modal");
        const isModalOpen = modal.style.display !== 'none' && modal.getAttribute('aria-hidden') === 'false';
        if(e.key === "Escape" || e.key === "Esc"){
            if (isModalOpen) {
             closeModal(e); 
             resetAddPicture(e);  
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

    projectElementModal.innerHTML = `<img src="${project.imageUrl}" alt="${project.title}">`;

    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash-can";
    trashIcon.setAttribute('data-id', project.id);
    trashIcon.setAttribute('tabindex', '0');
    trashIcon.addEventListener('click', function(){
        deleteProject(this.getAttribute('data-id'));
    })
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
                resetAddPicture();
            }
        });
    });
}

/// DELETE WORKS ///
document.addEventListener('DOMContentLoaded', function() {
    setupCloseIconKeyListener();
});

async function deleteProject(projectId) {
    console.log("Suppression du projet avec l'ID:", projectId);
    try {
        const response = await fetch(`${apiURL}/${projectId}`, {
        method: 'DELETE',
        headers: {
            accept: '*/*',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du projet');
        }
        document.querySelector(`[data-id="${projectId}"]`).closest('.projectModal').remove();

    } catch (error) {
        console.error('Erreur fetch:', error);
    }
}

// Récupération des catégories pour les insérer dans le select "catégorie" de la modale //
async function getCategories() {
    console.log("Récupération des catégories");
    try {
       const response = await fetch("http://localhost:5678/api/categories", {
        method: 'GET',
        headers: {
            'accept': 'application/json'
        }
        });
        if (response.ok){
            const categories = await response.json();
            console.log("Récupération des catégories RÉUSSIE");

            const selectCategory = document.getElementById("category");
            categories.forEach(category => {
                const optionCategory = document.createElement("option");
                optionCategory.classList.add("optionCategory");
                optionCategory.value = category.id;
                optionCategory.textContent = category.name;
                selectCategory.appendChild(optionCategory);
            })
        } else {
            console.log("Récupération des catégories a FAIL")
        } 
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
    }
    
}

getCategories();

// Ajout d'une photo en preview //


function loadImage() {
    const addPicButton = document.querySelector('.modal-button-add-pic');
    const imgInput = document.getElementById('imageInput');

    if (addPicButton && imgInput) {
        addPicButton.addEventListener('click', function() {
            imgInput.value = '';
            imgInput.click();
        });

        imgInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const maxSize = 4 * 1024 * 1024;
                if (file.size > maxSize) {
                    alert('Le fichier doit être inférieur à 4 Mo.');
                    return;
                } else {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const addPictureDiv = document.querySelector('.addPicture');
                        addPictureDiv.innerHTML = `<img src="${e.target.result}" alt="Aperçu" style="width: 100%;">`;
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    }
}




// Réinitialisation pour ne pas sauvegarder l'image quand je quitte la modale //

const initialAddPictureContent = `
<i class="fa-regular fa-image"></i>
<button class="modal-button modal-button-add-pic" type="button">+ Ajouter photo</button>
<p>jpg, png : 4mo max</p>`;

function resetAddPicture() {
    const addPictureDiv = document.querySelector('.addPicture');
    if (addPictureDiv) {
        addPictureDiv.innerHTML = initialAddPictureContent;
        
        document.querySelector('.modal-button-add-pic').addEventListener('click', function() {
            document.getElementById('imageInput').click();
            
        });
    }
}
loadImage();

function updateSubmitButtonState() {
    const btn = document.getElementById('sendProjectButton');
    const requiredFields = document.querySelectorAll('#addPictureForm [required]');
    const allFilled = Array.from(requiredFields).every(field => field.value.trim() !== '');
  
    if (allFilled) {
      btn.classList.remove('disabled');
      btn.classList.add('enabled');
      btn.disabled = false;
    } else {
      btn.classList.add('disabled');
      btn.classList.remove('enabled');
      btn.disabled = true;
    }
  }

document.addEventListener('DOMContentLoaded', function() {
    const requiredFields = document.querySelectorAll('#addPictureForm [required]');
  
    requiredFields.forEach(field => {
      field.addEventListener('input', updateSubmitButtonState);
    });
  
    updateSubmitButtonState();
});
  
// Poster un projet //

async function postProject(formData){
    try {
        const response = await fetch('http://localhost:5678/api/works', {
                method: "POST",
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
        })
        if(!response.ok) throw new Error('Erreur lors de l\'envoi du projet');
        const result = await response.json();
        console.log('Projet envoyé avec succès', result);
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données', error);
    }
    
}

document.getElementById("addPictureForm").addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new FormData(this);
    postProject(formData);
})