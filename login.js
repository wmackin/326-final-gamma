const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', async  e => {
    console.log('Event has occured');
    //let data = JSON.stringify({
        //"user" : document.getElementById("username").value,
        //"password": document.getElementById("password").value, 
    //});
    const response = await fetch('/login', {
        method: "POST",
        headers:  {'Content-Type': 'application/json'},
        //body: data,
    })
    console.log(response);
    if (response.ok) {
        const request = await response.json()
        console.log(request);
        if (request === '1' || request === 1) {
            console.log('true');
            window.location.assign('/user');
        }
    }
});
const signupButton = document.getElementById('signupButton');
signupButton.addEventListener('click', async  e => {
    window.location.assign('/signup');
});