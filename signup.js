const sumbitButton = document.getElementById('signupButton');
sumbitButton.addEventListener('click', async  e => {
    console.log('Event has occured');
    console.log({
        "user" : document.getElementById("username").value,
        "password": document.getElementById("pwd").value, 
        "champion": document.getElementById("champion").value,
        "region": document.getElementById("region").value,
        "position": document.getElementById("position").value,
        "story": document.getElementById("story").value,
        "rank": document.getElementById("rank").value,
    })
    let data = JSON.stringify({
        "user" : document.getElementById("username").value,
        "password": document.getElementById("pwd").value, 
        "champion": document.getElementById("champion").value,
        "region": document.getElementById("region").value,
        "position": document.getElementById("position").value,
        "story": document.getElementById("story").value,
        "rank": document.getElementById("rank").value,
    });
    console.
    console.log(data)
    const response = await fetch('/signup', {
        method: "POST",
        headers:  {'Content-Type': 'application/json'},
        body: data,
    })
    console.log(response);
    location.reload(); 
});