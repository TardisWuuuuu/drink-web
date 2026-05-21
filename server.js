const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, 'frontend')))

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'frontend/index.html'))
})

app.get('/submit.html',(req,res)=>{
  res.sendFile(path.join(__dirname,'frontend/submit.html'))
})

const port = process.env.PORT || 3000
app.listen(port,'0.0.0.0',()=>{
  console.log('run ok')
})