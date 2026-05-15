const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/drinks.json');
const AVATAR_DIR = path.join(__dirname, '../public/avatars/');

if (!fs.existsSync(AVATAR_DIR)) fs.mkdirSync(AVATAR_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(DATA_PATH))) fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, '[]');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeData(arr) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(arr, null, 2), 'utf8');
}

function parseMultipart(req, callback) {
  let body = [];
  req.on('data', chunk => body.push(chunk));
  req.on('end', () => {
    const buffer = Buffer.concat(body);
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('boundary')) return callback(null, {});
    const boundary = contentType.split('boundary=')[1];
    const parts = buffer.toString().split(`--${boundary}`);
    let fileName = '', fileData = null;
    parts.forEach(part => {
      if (part.includes('filename=')) {
        const fn = part.match(/filename="([^"]+)"/);
        if(fn) fileName = fn[1];
        const start = part.indexOf('\r\n\r\n') + 4;
        const end = part.lastIndexOf('\r\n');
        fileData = buffer.slice(start, end);
      }
    });
    callback(null, { fileName, fileData });
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.end();

  if (req.url === '/api/list') {
    res.writeHead(200, {'Content-Type':'application/json;charset=utf-8'});
    return res.end(JSON.stringify(readData()));
  }

  if (req.url === '/api/random') {
    let arr = readData();
    let item = arr[Math.floor(Math.random() * arr.length)] || {};
    res.writeHead(200, {'Content-Type':'application/json;charset=utf-8'});
    return res.end(JSON.stringify(item));
  }

  if (req.url === '/api/add' && req.method === 'POST') {
    let body = '';
    req.on('data',c=>body+=c);
    req.on('end',()=>{
      let obj = JSON.parse(body);
      obj.id = Date.now();
      obj.scores = [];
      obj.comments = [];
      obj.createTime = new Date().toLocaleString();
      let list = readData();
      list.push(obj);
      writeData(list);
      res.end(JSON.stringify({ok:1}));
    });
    return;
  }

  if (req.url === '/api/saveAll' && req.method === 'POST') {
    let body = '';
    req.on('data',c=>body+=c);
    req.on('end',()=>{
      writeData(JSON.parse(body));
      res.end(JSON.stringify({ok:1}));
    });
    return;
  }

  if (req.url === '/api/uploadAvatar' && req.method === 'POST') {
    parseMultipart(req,(err,{fileName,fileData})=>{
      if(!fileData){
        res.writeHead(400,{'Content-Type':'application/json'});
        return res.end(JSON.stringify({ok:false}));
      }
      const ext = path.extname(fileName);
      const newName = `av_${Date.now()}${ext}`;
      const savePath = path.join(AVATAR_DIR,newName);
      fs.writeFileSync(savePath,fileData);
      const url = `/public/avatars/${newName}`;
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify({ok:true,url}));
    });
    return;
  }

  if (req.url.startsWith('/public/avatars/')) {
    const filePath = path.join(__dirname,'../',req.url);
    if(fs.existsSync(filePath)){
      let type = 'image/jpeg';
      if(filePath.endsWith('.png')) type='image/png';
      if(filePath.endsWith('.gif')) type='image/gif';
      res.writeHead(200,{'Content-Type':type});
      return res.end(fs.readFileSync(filePath));
    }
    res.writeHead(404);
    return res.end('404');
  }

  let file = req.url === '/' ? '/index.html' : req.url;
  let fullPath = path.join(__dirname,'../frontend',file);
  let ext = path.extname(fullPath);
  let mime = 'text/html;charset=utf-8';
  if(ext=='.css') mime='text/css';
  if(ext=='.js') mime='text/javascript';

  fs.readFile(fullPath,(err,data)=>{
    if(err){
      res.writeHead(404);
      return res.end('页面不存在');
    }
    res.writeHead(200,{'Content-Type':mime});
    res.end(data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
  console.log(`服务运行端口：${PORT}`);
});