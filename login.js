console.log("in login.js");
document.getElementById("loginButton").addEventListener("click", async () => {
    console.log('found event');
    response = await fetch('./login', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    console.log(response);
    if (response.ok) {
        request = response.json();
        console.log(request);
        request.then(request => console.log(request));
    }
    response = await fetch('./login', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    console.log(response);
    if (response.ok) {
        request = response.json();
        console.log(request);
        request.then(request => console.log(request));
        window.location.assign("./index.html");
    }
});