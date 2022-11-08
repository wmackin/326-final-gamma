document.getElementById("loginButton").addEventListener("click:", async () => {
    let response = await fetch("/login?username=testuser");
    if (response.ok) {
        console.log(response.json())
    }
})