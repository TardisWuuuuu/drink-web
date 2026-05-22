const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

const dataFile = path.join(__dirname, 'data.json');

// 自动创建 data.json
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({ list: [] }, null, 2));
}

// 获取数据
app.get('/api/get', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    res.json(data);
  } catch (e) {
    res.json({ list: [] });
  }
});

// 保存数据
app.post('/api/save', (req, res) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false });
  }
});

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('服务已启动');
});