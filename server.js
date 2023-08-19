const http = require('http');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/login', (req, res, next) => {
    res.send(`<form onsubmit="localStorage.setItem('username', document.getElementById('username').value)" action="/xyz" method="POST">
    <input id="username" type="text" name="username">
    <button type="submit">Login</button>
    </form>`);
});

app.use('/xyz', (req, res, next) => {
    if (!fs.existsSync('message.txt')) {
        fs.writeFileSync('message.txt', '');
    }
    fs.readFile('message.txt', 'utf8', (err, content) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error loading chat history.');
        } else {
            const chatForm = `<form onsubmit="document.getElementById('hiddenUsername').value = localStorage.getItem('username')" action="/chatBox" method="POST">
            <input type="text" name="msg">
            <input type="hidden" name="username" id="hiddenUsername">
            <button type="submit">send</button>
            </form>`;
            const pageContent = content + '<br>' + chatForm;

            res.send(pageContent);
        }
    });
});

app.post('/chatBox', (req, res, next) => {
    console.log(req.body);
    const message = req.body.msg;
    const username = req.body.username; // Retrieve the username from the hidden field
    const messageWithUsername = username + ': ' + message + '\n'; // Include the username in the message
    fs.appendFile('message.txt', messageWithUsername, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).send('Error saving message.');
        } else {
            console.log('Message saved:', messageWithUsername);
            res.redirect('/xyz');
        }
    });
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
