const apiURL = "http://localhost:5678/api/works";

let globalProjectsData = [];
let categoryToIdMap = {};
let gallery = document.querySelector(".gallery");
let portfolio = document.getElementById("portfolio");
let divFilters = document.createElement("div");
divFilters.classList.add("filters");
portfolio.insertBefore(divFilters, gallery);

async function getProjects() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        console.log(data);
        globalProjectsData = data;
        createCategoryToIdMap(data);
        createFilterButtons();
        showProjects(data);
        showProjectsInModal();
    } catch (error){
        console.error('Error fetching projects:', error);
    }
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
    projectElement.setAttribute('data-id', project.id)
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
if (storedToken){
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

    myProjects.style.marginBottom  = "0px";

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

// Fonction qui crée et affiche chaque projet récupéré depuis l'API dans la modale  //
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
        document.querySelector(".modalContent").innerHTML = '';
        showProjectsInModal();
        setupImageUploadListener()
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
checkAndOpenActiveModal();    
    
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
            setupImageUploadListener()

            if (previouslyFocusedElement !== null) {
                previouslyFocusedElement.focus()
            }
        }
    }

    // Îcones de fermeture de la modale//
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
        });
    } else {
        console.error("Icône de sortie de l'ajout de photo introuvable")
    }

    // Fermeture de la modale en cliquant sur le fond //
    window.addEventListener('click', function(event) {
        let modal = document.getElementById("modal");
        if(event.target === modal) {
            closeModal();
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
    setupModalTriggers();

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

// Fonction qui crée le format de chaque projet dans la modale ainsi que l'icône de suppression //
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

setupCloseIconKeyListener();
/// DELETE WORKS ///


async function deleteProject(projectId) {
    console.log("Suppression du projet avec l'ID:", projectId);
    try {
        const response = await fetch(`${apiURL}/${projectId}`, {
        method: 'DELETE',
        headers: {
            "accept": "*/*",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du projet');
        }
        console.log("Travail supprimé avec succès.");
        globalProjectsData = globalProjectsData.filter((project) => project.id != projectId);
        document.querySelector(`[data-id="${projectId}"]`).closest('.projectModal').remove();
        const projectElementOnHomePage = document.querySelector(`.project[data-id="${projectId}"]`);
        if (projectElementOnHomePage) {
            projectElementOnHomePage.remove();
        }
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

function setupImageUploadListener(){
    const pictureInput = document.getElementById('imageInput');
    const addPicButton = document.querySelector('.modal-button-add-pic');

    if (addPicButton) {
        addPicButton.onclick = function() {
            if (pictureInput) {
                pictureInput.click();
            }
        }
    }
    if (pictureInput){
        pictureInput.onchange = function(){
            const [file] = this.files;
            if (file.size <= 4 * 1024 * 1024) {
                const picturePreviewDiv = document.querySelector('.addPicture');
                picturePreviewDiv.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Aperçu" style="width: 100%;">`;
            } else {
                alert('Le fichier doit être inférieur à 4 Mo.');
            }
        }
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
    }
    document.getElementById('imageInput').value = '';
}

function resetAddProjectModal() {
    document.getElementById("addPictureForm").reset();
    const addPictureDiv = document.querySelector('.addPicture');
    addPictureDiv.innerHTML = `
        <i class="fa-regular fa-image"></i>
        <button class="modal-button modal-button-add-pic" type="button">+ Ajouter photo</button>
        <p>jpg, png : 4mo max</p>
    `;
}

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
  
// POST un projet //

async function createNewWork(title, category, imageFile){
    let errors = [];
    if (!title || title.trim().length === 0) {
        errors.push("Titre manquant.");
    };
    if(!imageFile || imageFile.size === 0){
        errors.push("Image manquante.");
    };
    if (errors.length > 0) {
        alert(`Le formulaire n'est pas correctement rempli:\n${errors.join('\n')}`);
        return;
    };
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", imageFile);
    try {
        const response = await fetch(`${apiURL}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData 
        });
        if (response.status === 201) {
            const responseData = await response.json();
            console.log('Travail créé avec succès:', responseData);
            globalProjectsData.push(responseData);
            const newProjectElement = createProjectElement(responseData);
            gallery.appendChild(newProjectElement);
            closeModal();
            resetAddProjectModal();
        } else if (response.status === 400) {
            console.error("Erreur : Mauvaise demande");
        } else if (response.status === 401) {
            console.error("Erreur: non autorisé.")
        } else if(response.status === 500) {
            console.error(`Erreur non gérée (statut : ${response.status})`);
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la requête:', error);
    }
}

document.getElementById("addPictureForm").addEventListener('submit', async function(e){
    e.preventDefault();
    const formData = new FormData(this);

    const title = formData.get('title');
    const category = formData.get('category');
    const imageFile = formData.get('image');

    try {
        const newWork = await createNewWork(title, category, imageFile);
    } catch (error) {
        console.error('Erreur lors de la création du travail:', error);
    }
});