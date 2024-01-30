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
const storedToken = localStorage.getItem('token');
if (storedToken === 'eyJhbGciOiJIeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4UzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4'){
    console.log("Token correspond ! Prêt à créer de nouveaux éléments");
    let banner = document.createElement("div");
    banner.classList.add("banner");
    document.body.appendChild(banner);
    const header = document.querySelector('header');
    if (header) {
        header.insertAdjacentElement('beforebegin', banner);
    }
    let bannerIcon = document.createElement("i");
    bannerIcon.className = "fa-regular fa-pen-to-square";
    let bannerPrg = document.createElement("p");
    bannerPrg.classList.add("bannerPrg");
    banner.appendChild(bannerIcon);
    banner.appendChild(bannerPrg);
    bannerPrg.innerHTML = "Mode Édition";

}