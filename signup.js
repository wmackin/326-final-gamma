document.getElementById("signupButton").addEventListener("click", async () => {
    response = await fetch('./login', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    if (response.ok) {
        request = response.json();
        request.then(request => console.log(request));
        window.location.assign("./index.html");
    }
});