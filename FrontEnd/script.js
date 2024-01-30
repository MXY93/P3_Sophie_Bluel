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

// JavaScript pour l'admin //

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

// Javascript pour la modale //

const galleryModal = document.querySelector(".modalContent");

function showProjectsInModal(){
    globalProjectsData.forEach(project => {
        const projectElementModal = createProjectElementModal(project);
        document.querySelector(".modalContent").appendChild(projectElementModal);
    });
}
function openModal () {
    let modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = 'flex';
        localStorage.setItem('modalOpen', 'true');
        document.getElementById("modal-wrapper-PictureAdd").style.display = "none";
    } else {
        console.error("Élément modal introuvable")
    }
}


document.addEventListener('DOMContentLoaded', function() {
    let modalOpen = localStorage.getItem('modalOpen');
    if (modalOpen === 'true') {
        openModal();
    }
    function closeModal () {
        let modal = document.getElementById("modal");
        if (modal) {
            modal.style.display="none";
            localStorage.removeItem('modalOpen');
        }
    }
    let exitIcon = document.getElementById("exitIcon");
    if (exitIcon) {
        exitIcon.addEventListener('click', closeModal);
    } else {
        console.error("Icône de sortie introuvable")
    }
    window.addEventListener('click', function(event) {
        let modal = document.getElementById("modal");
        if(event.target === modal) {
            closeModal()
        }
    })
    let editLink = document.getElementById('editLink');
    if (editLink) {
        editLink.addEventListener('click', function(e){
            e.preventDefault();
        });
    } else {
        console.error("Lien d'édition introuvable")
    }
});

function createProjectElementModal(project){
    const projectElementModal = document.createElement("figure");
    projectElementModal.className = "projectModal";
    projectElementModal.innerHTML = `<img src="${project.imageUrl}" alt="${project.title}">`;
  return projectElementModal;
};
