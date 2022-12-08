
let signupButton = document.getElementById('signupButton');
signupButton.addEventListener('click', async  e => {
    console.log('Event has occured');
    let data = JSON.stringify({
        "user" : document.getElementById("username").value,
        "password": document.getElementById("pwd").value, 
        "champion": document.getElementById("champion").value,
        "region": document.getElementById("region").value,
        "position": document.getElementById("position").value,
        "story": document.getElementById("story").value,
        "rank": document.getElementById("rank").value,
    });
    console.log(data)
    const response = await fetch('/signup', {
        method: "POST",
        headers:  {'Content-Type': 'application/json'},
        body: data,
    })
    console.log(response);
    location.reload(); 
});