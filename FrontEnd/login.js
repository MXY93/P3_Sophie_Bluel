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
            let filterButtons = document.querySelectorAll('.boutonsFiltre');
            filterButtons.forEach(button => {
            button.style.display = 'none';
            return response.json();
        });
        } else if (response.status === 401) {
            throw new Error('Informations d\'identification incorrectes.');
        } else if (response.status === 404) {
            throw new Error('Utilisateur non trouvé');
        } else {
            throw new Error('Erreur non gérée.');
        }
    }).then((data) => {
        localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNzA1ODA4NywiZXhwIjoxNzA3MTQ0NDg3fQ.cnxALRcvidy9L7IDksHBxpC0RUIxcvJ_S9bCiuVXQe0');
        window.location.replace("index.html");
    }).catch((error) => {
        console.log('Erreur lors de la connexion:', error);
        alert(error.message);
    });
});