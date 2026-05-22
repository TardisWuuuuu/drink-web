const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('./'));

const dbPath = path.join(__dirname, 'db.json');
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify([]));

app.get('/getList', (req, res) => {
  res.json(JSON.parse(fs.readFileSync(dbPath)));
});

app.post('/saveList', (req, res) => {
  fs.writeFileSync(dbPath, JSON.stringify(req.body, null, 2));
  res.send('ok');
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/submit.html', (req, res) => res.sendFile(path.join(__dirname, 'submit.html')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Running'));