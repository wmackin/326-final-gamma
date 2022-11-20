document.getElementById('submitPost').addEventListener('click', async () => {
    const user = "test";
    const review = document.getElementById("submitPost");
    await fetch(`/addPost?user=user&review=${review}&lore=${champion.name}`);
    await fetch(`/champion/${champion.name}`);
});