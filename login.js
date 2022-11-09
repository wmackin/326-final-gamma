document.getElementById("loginButton").addEventListener("click", async () => {
    response = await fetch('https://whispering-woodland-38762.herokuapp.com/login', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "username": "test", "password": "password123" })
    })
    if (response.ok) {
        response.then(response => response.json()).then(response => console.log(JSON.stringify(response)));
    }
});