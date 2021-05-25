import * as path from "path";
const express = require('express')
const app = express()
const port = 3000

app.set('views', path.resolve('public'))
app.set('view engine', 'pug')
app.use(express.static('public'));

app.get('/', function (_req, res) {
  res.render('index.pug', { title: 'Hey', message: 'Hello there!' })
})
app.get('/flow/in', function (_req, res) {
  res.render('identity/login.pug')
})
// Nice easter egg here
app.get('/%F0%9F%98%89', function (_req, res) {
  res.render('easterg/😉.pug')
})
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })