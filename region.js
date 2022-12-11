async function render() {
    response = await fetch('./regionInfo', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        request = response.json();
        request.then(request => {
            document.getElementById('regionName').innerHTML = request.name;
            document.getElementById('regionImage').src = request.img;
        });
    }
    else {
        console.log("Call not ok")
    }
}

window.onload = render();