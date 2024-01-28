const apiURL = "http://localhost:5678/api/works"

let globalProjectsData = [];
function getProjects() {
   fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        globalProjectsData = data;
        createFilterButtons(data);
        showProjects(data);
    }) 
}

getProjects();
function showProjects(data) {
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = "";
    data.forEach(project => {
        const projectFigure = document.createElement("figure");

        const projectImage = document.createElement("img");
        projectImage.src = project.imageUrl;
        projectImage.alt = project.title;

        const projectFigcaption = document.createElement("figcaption");
        projectFigcaption.textContent = project.title;

        projectFigure.appendChild(projectImage);
        projectFigure.appendChild(projectFigcaption);

        gallery.appendChild(projectFigure);
})}


const gallery = document.querySelector(".gallery")

const buttonNames = ["Objets", "Appartements", "Hôtels & restaurants"];
const divFilters = document.createElement("div");
divFilters.classList.add("filters");
const portfolio = document.getElementById("portfolio");
const filterContainer = document.querySelector(".filters")




function createFilterButtons(data) {
    const uniqueCategoryNames = [...new Set(data.map(item => item.category.name))];
    const filterButtonsContainer = divFilters;

    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.id="all";
    allButton.addEventListener("click", () => showAllProjects());
    filterButtonsContainer.appendChild(allButton);

    uniqueCategoryNames.forEach(categoryName => {
        const button = document.createElement('button');
        button.innerText = categoryName;
        button.addEventListener('click', () => filterItems(categoryName));
        filterButtonsContainer.appendChild(button);
    });
}
portfolio.appendChild(divFilters);
portfolio.insertBefore(divFilters, gallery);

function showAllProjects(){
    const projectsContainer = document.querySelector(".gallery");
    projectsContainer.innerHTML = '';
    showProjects(globalProjectsData);
}
showAllProjects()
function filterItems(categoryName) {
    const categoryId = globalProjectsData.find(project => project.category.name === categoryName).category.id;
    const filteredProjects = globalProjectsData.filter(project => project.categoryId === categoryId);
    const projectsContainer = document.querySelector(".gallery");
    projectsContainer.innerHTML = '';

    filteredProjects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project';
        projectElement.innerHTML = `<img src="${project.imageUrl}" alt="${project.title}">
                                    <h3>${project.title}</h3>`
        projectsContainer.appendChild(projectElement);
    });
    console.log(projectsContainer);
}
