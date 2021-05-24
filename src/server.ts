import * as path from "path";
const express = require('express')
const app = express()
const port = 3000

app.set('views', path.resolve('public'))
app.set('view engine', 'pug')

app.get('/', function (_req, res) {
  res.render('index.pug', { title: 'Hey', message: 'Hello there!' })
})
  
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })