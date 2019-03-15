const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

var root = module.parent ? path.dirname(module.parent.filename) : __dirname;

function readDir(mypath, callback) {
  var postData = [];
  mypath = path.isAbsolute(mypath) ? mypath : path.join(root, mypath);
  fs.readdir(mypath, (err, files) => {
    for (var i = 0; i < files.length; i++) {
      var stats = fs.statSync(path.join(root, path.basename(mypath), files[i]));
      if (stats.isDirectory()) {
        postData.push({ fileName: files[i] });
      }
    }
    callback(postData);
  });
}

function upload(req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = './public';
  form.keepExtensions = true;
  form.maxFileSize = 1000 * 1000 * 1000;
  form.parse(req, (err, fields, files) => {
    var oldPath = path.join(root, files.myfile.path);
    var newPath = path.join(
      root,
      './public',
      fields.folder,
      path.basename(files.myfile.path)
    );
    fs.rename(oldPath, newPath, err => {
      if (!err) {
        res.render('succ');
      } else {
        res.send('上传失败');
      }
    });
  });
}

function showFolder(req, res) {
  readDir('./public', data => {
    res.render('photos', { list: data });
  });
}
function readFile(mypath, callback) {
  var postData = [];
  fs.readdir(mypath, (err, files) => {
    for (let i = 0; i < files.length; i++) {
      postData.push(files[i]);
    }
    callback(postData);
  });
}
function showFile(req, res) {
  let folder = req.params.id;
  let renderArr = [];
  readFile(path.join(root, 'public', folder), data => {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        renderArr.push(path.join(folder, data[i]));
      }
    } else {
      renderArr = [];
    }
    let str = renderArr[0];
    console.log(str)
    if (!str) {
      res.render('scanFile2', { list: ['02'] });
    } else if (
      str.indexOf('.jpg') !== -1 ||
      str.indexOf('.jpeg') !== -1 ||
      str.indexOf('.png') !== -1 ||
      str.indexOf('.gif') !== -1
    ) {
      res.render('scanFile', { list: renderArr });
    } else {
      res.render('scanFile2', { list: renderArr });
    }
  });
}
module.exports = { readDir, upload, showFolder, showFile };
