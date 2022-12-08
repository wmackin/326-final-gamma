const sumbitButton = document.getElementById('signupButton');
sumbitButton.addEventListener('click', async  e => {
    console.log('Event has occured');
    console.log({
        "user" : document.getElementById("username").innerText,
        "password": document.getElementById("pwd").value, 
        "champion": document.getElementById("champion").innerText,
        "region": document.getElementById("region").innerText,
        "position": document.getElementById("position").innerText,
        "story": document.getElementById("story").innerText,
        "rank": document.getElementById("rank").innerText,
    })
    let data = JSON.stringify({
        "user" : document.getElementById("username").innerText,
        "password": document.getElementById("pwd").value, 
        "champion": document.getElementById("champion").innerText,
        "region": document.getElementById("region").innerText,
        "position": document.getElementById("position").innerText,
        "story": document.getElementById("story").innerText,
        "rank": document.getElementById("rank").innerText,
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