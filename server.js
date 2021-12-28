const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('public'));

// 404 error
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/404.html');
})

app.listen(port);