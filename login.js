const loginButton = document.getElementById('signupButton');
loginButton.addEventListener('click', async  e => {
    console.log('Event has occured');
    let data = JSON.stringify({
        "user" : document.getElementById("username").value,
        "password": document.getElementById("password").value, 
    });
    const response = await fetch('/login', {
        method: "POST",
        headers:  {'Content-Type': 'application/json'},
        body: data,
    })
    console.log(response);
});