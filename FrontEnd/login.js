const apiURL = "http://localhost:5678/api/users/login";

const loginFormToSend = document.querySelector(".login_formToSend");
loginFormToSend.addEventListener("submit", function (event) {
    event.preventDefault();
    const loginData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };
    const chargeUtile = JSON.stringify(loginData);
    fetch(apiURL, {
        method : 'POST', 
        headers: {'Content-Type': 'application/json'},  
        body: chargeUtile
    }).then((response) => {
        if (response.status === 200) {
            return response.json();
            let filterButtons = document.querySelectorAll('.boutonsFiltre');
            filterButtons.forEach(button => {
            button.style.display = 'none';
        });
        } else if (response.status === 401) {
            throw new Error('Informations d\'identification incorrectes.');
        } else if (response.status === 404) {
            throw new Error('Utilisateur non trouvé');
        } else {
            throw new Error('Erreur non gérée.');
        }
    }).then((data) => {
        localStorage.setItem('token', 'eyJhbGciOiJIeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4UzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4');
        window.location.replace("index.html");
    }).catch((error) => {
        console.log('Erreur lors de la connexion:', error);
        alert(error.message);
    });
});