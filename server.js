const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

const dataPath = path.join(__dirname, 'data.json');
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({ list: [] }));
}

// 读数据
app.get('/getAllData', (req, res) => {
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    res.json(JSON.parse(raw));
  } catch (e) {
    res.json({ list: [] });
  }
});

// 写数据
app.post('/setAllData', (req, res) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'write fail' });
  }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/submit.html', (req, res) => res.sendFile(path.join(__dirname, 'submit.html')));

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log('服务正常运行 on port', port);
});