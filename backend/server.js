const express = require('express');
const app = express();
const path = require('path');

// 静态文件托管
app.use(express.static(path.join(__dirname, '../frontend')));

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 必须写 0.0.0.0 + 环境变量端口，Railway 强制要求
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ 服务启动成功，端口：', PORT);
});