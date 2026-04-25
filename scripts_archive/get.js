fetch('http://localhost:3000/api/dump').then(async r => {
    console.log(r.status);
    console.log(await r.text());
});
