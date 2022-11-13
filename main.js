async function updateSignIn() {
    response = await fetch('./isSignedIn', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        request = response.json();
        request.then(request => {
            if (request.signedIn) {
                document.getElementById('signupLoginButton').innerHTML = 'Account';
            }
            document.getElementById('signupLoginButton').addEventListener('click', () => {
                if (request.signedIn) {
                    window.location.assign("./account.html");
                }
                else {
                    window.location.assign("./login.html");
                }
            })
        });
    }
}
window.onload = updateSignIn;

document.getElementById('signupLoginButton').addEventListener('click', async () => {
    response = await fetch('./login', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        request = response.json();
        request.then(request => {
            window.location.assign("./login.html");
        });
    }
})

document.getElementById('demaciaButton').addEventListener('click', async () => {
    console.log('test');
    response = await fetch('./goToRegion', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        request = response.json();
        request.then(request => {
            window.location.assign("./region.html");
        });
    }

})