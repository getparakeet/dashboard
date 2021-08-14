const express = require('express');
const cors = require('cors');
import * as path from "path";
const app = express();

app.set('views', path.resolve('public'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(cors());
// Identity

app.get('/', (req: any, res: any) => {
  res.render('index.pug', { title: 'Hey', message: 'Hello there!' })
})
  app.listen(3000, () => {
    console.log(`App listening at http://localhost:3000`)
  })