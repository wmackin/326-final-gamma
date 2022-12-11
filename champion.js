
const sumbitButton = document.getElementById('sumbitButton');
sumbitButton.addEventListener('click', async e => {
    console.log('Event has occured');
    const userResponse = await fetch('/signedInUser');
    let user;
    if (userResponse.ok) {
        let userJSON = await userResponse.json();
        user = userJSON[user]
        console.log(user);
        if (user === undefined) {
            user = "Anonymous";
        }
    }
    else {
        user = "Anonymous";
    }
    let data = JSON.stringify({
        "user": user,
        "review": document.getElementById("reviewBox").value,
        "lore": document.getElementById("name").innerText
    });
    console.log(data)
    const response = await fetch('/addPost', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: data,
    })
    console.log(response);
    location.reload();
});

if (document.getElementById("login-button")) {
    document.getElementById("login-button").addEventListener("click", async () => {
        window.location.assign("/login");
    });
}

if (document.getElementById("account-button")) {
    document.getElementById("account-button").addEventListener("click", async () => {
        window.location.assign("/user");
    });
}
//sumbitButton.addEventListener('click', location.reload.bind(window.location));
