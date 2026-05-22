const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const dbPath = path.join(__dirname, 'data.json');

// 初始化数据库文件
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({list:[]}, null, 2));
}

// 获取全部数据
app.get('/api/getData', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  res.json(data);
});

// 保存全部数据
app.post('/api/saveData', (req, res) => {
  fs.writeFileSync(dbPath, JSON.stringify(req.body, null, 2));
  res.json({code:200});
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务运行中，端口${PORT}`);
});