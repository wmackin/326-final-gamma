
const sumbitButton = document.getElementById('sumbitButton');
let user = "test"
sumbitButton.addEventListener('click', async  e => {
    console.log('Event has occured');
    let data = JSON.stringify({
        "user" : "test",
        //review: document.getElementById("reviewBox").value, 
        //lore: document.getElementById("name").innerText
    });
    console.log(data)
    const response = await fetch('/addPost', {
        method: "POST",
        mode : "cors",
        headers:  {'Content-Type': 'application/json'},
        body: data,
    })
    console.log(response);
    location.reload(); 
});
//sumbitButton.addEventListener('click', location.reload.bind(window.location));
