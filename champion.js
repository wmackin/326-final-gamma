
const sumbitButton = document.getElementById('sumbitButton');
let user = "test"
sumbitButton.addEventListener('click', async  e => {
    console.log('TEST');
    let data = {
        user: "test",
        review: document.getElementById("reviewBox").value, 
        lore: document.getElementById("name").innerText
    };
    await fetch('/addPost', {
        method: 'POST',
        mode : 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).catch(err => console.log(err));
    console.log('test confirm');
});
sumbitButton.addEventListener('click', location.reload.bind(window.location));
async function postReview(){
    console.log('TEST');
    let data = {
        user: "test",
        review: document.getElementById("reviewBox").value, 
        lore: document.getElementById("name").innerText
    };
    await fetch('/addPost', {
        method: 'POST',
        mode : 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).catch(err => console.log(err));
    console.log('test confirm');
    return;
}
