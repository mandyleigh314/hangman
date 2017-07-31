const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const fs = require('fs')
//below I should be calling the functions.js
const functions = require('./functions.js')
const words = fs.readFileSync('/usr/share/dict/words', 'utf-8').toLowerCase().split('\n')

let guessedLetters = []

app = express()

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('mst', mustacheExpress())
app.set('views', './templates')
app.set('view engine', 'mst')

app.get('/', (req, res) => {
  console.log(words)
  res.render('index')
})

app.listen(3000, () => {
  console.log('there is life on 3000')
})
