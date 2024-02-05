let apiURL = "http://localhost:5678/api/users/login";

let loginFormToSend = document.querySelector(".login_formToSend");
loginFormToSend.addEventListener("submit", function (event) {
    event.preventDefault();
    let loginData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };
    fetch(apiURL, {
        method : 'POST', 
        headers: {'Content-Type': 'application/json'},  
        body: JSON.stringify(loginData),
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                localStorage.setItem('token', data.token);
                window.location.replace("index.html");
            });
            let filterButtons = document.querySelectorAll('.boutonsFiltre');
            filterButtons.forEach(button => {
            button.style.display = 'none';   
        });
        } else if (response.status === 401) {
            throw new Error('Mot de passe incorrect');
        } else if (response.status === 404) {
            throw new Error('Erreur dans l’identifiant ou le mot de passe');
        } else {
            throw new Error('Erreur non gérée.');
        }
    }).catch(error => {
        console.log('Erreur lors de la connexion:', error);
        alert(error.message);
    });
});