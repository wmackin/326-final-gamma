async function loadRegions() {
    const response = await fetch('/getRegions');
    if (response.ok) {
        const regionjson = response.json();
        regionjson.then(regions => {
            let gridContainer = document.getElementById('regionGrid');
            let rowDiv = document.createElement("div");
            rowDiv.classList.add('row');
            for (let i = 0; i < regions.length; i++) {
                if (i % 4 === 0 && i !== 0) {
                    gridContainer.appendChild(rowDiv);
                    rowDiv = document.createElement("div");
                    rowDiv.classList.add('row');
                }
                let colDiv = document.createElement("div");
                colDiv.classList.add('col');
                let newButton = document.createElement("button");
                newButton.type = "button";
                newButton.classList.add('btn');
                newButton.classList.add('btn-secondary');
                newButton.classList.add('btn-square-lg');
                newButton.classList.add('ms-1');
                newButton.addEventListener("click", () => {
                    window.location.assign("/region?name=" + regions[i].name);
                });
                let textNode = document.createTextNode(regions[i].name);
                newButton.appendChild(textNode);
                colDiv.appendChild(newButton);
                rowDiv.appendChild(colDiv);
            }
            gridContainer.appendChild(rowDiv);
        });
    }
    const userResponse = await fetch('/signedInUser');
    let user;
    if (userResponse.ok) {
        let userJSON = await userResponse.json();
        user = userJSON['user']
        if (user === undefined) {
            user = "Anonymous";
        }
    }
    else {
        user = "Anonymous";
    }
    if (user !== "Anonymous") {
        document.getElementById('signupLoginButton').textContent = user;
        document.getElementById('signupLoginButton').addEventListener('click', async () => {
            window.location.assign("/user");
        });
    }
    else {
        document.getElementById('signupLoginButton').addEventListener('click', async () => {
            window.location.assign("/login");
        });
    }
}

window.onload = loadRegions();