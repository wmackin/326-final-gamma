const signupButton = document.getElementById('signupButton');
signupButton.addEventListener('click', async  e => {
    let data = JSON.stringify({
        "user" : document.getElementById("username").value,
        "password": document.getElementById("pwd").value, 
        "champion": document.getElementById("champion").value,
        "region": document.getElementById("region").value,
        "position": document.getElementById("position").value,
        "story": document.getElementById("story").value,
        "rank": document.getElementById("rank").value,
    });
    const response = await fetch('/signup', {
        method: "POST",
        redirect: 'follow',
        headers:  {'Content-Type': 'application/json'},
        body: data,
    });
    if (response.ok) {
        if (response.redirected) {
            window.location.assign(response.url);
        }
    }
});