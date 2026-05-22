const express = require('express');
const app = express();
const path = require('path');

// 静态文件自动托管
app.use(express.static(__dirname));

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 投稿页
app.get('/submit.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'submit.html'));
});

// 关键：Railway 必须这样写才不会 502
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log("✅ 服务启动成功");
});