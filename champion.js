
const sumbitButton = document.getElementById('sumbitButton');
let user = "test"
sumbitButton.addEventListener('click', postReview);
sumbitButton.addEventListener('click', location.reload.bind(window.location));
async function postReview(){
    let data = {
        user: "test",
        review: document.getElementById("reviewBox").value, 
        lore: document.getElementById("name").innerText
    };
    await fetch('http://localhost:8000/addPost', {
        method: 'POST',
        mode : 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).catch(err => console.log(err));
    return;
}
