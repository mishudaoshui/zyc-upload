const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const deal = require('./controller/dealData');

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {
  deal.readDir('./public', data => {
    res.render('index', { list: data });
  });
});
app.post('/postData', deal.upload);

app.get('/showFolder', deal.showFolder);
app.get('/showPic/:id', deal.showFile);

app.listen(3000,()=>{
  console.log('请用浏览器器打开：  '+ 'http://localhost:3000/')
})
