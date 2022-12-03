
const sumbitButton = document.getElementById('sumbitButton');
let user = "test"
sumbitButton.addEventListener('click', async  e => {
    console.log('Event has occured');
    let data = {
        "user" : "test",
        //review: document.getElementById("reviewBox").value, 
        //lore: document.getElementById("name").innerText
    };
    console.log(JSON.stringify(data))
    const response = await fetch('/addPost', {
        method: "POST",
        mode : "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    console.log(response);
    location.reload(); 
});
//sumbitButton.addEventListener('click', location.reload.bind(window.location));
