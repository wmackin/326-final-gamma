console.log("in main.js")
async function updateSignIn() {
    response = await fetch('./isSignedIn', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    console.log(response);
    if (response.ok) {
        request = response.json();
        console.log(request);
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