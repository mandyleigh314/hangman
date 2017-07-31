const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const fs = require('fs')
//below I should be calling the functions.js
const functions = require('./functions.js')
const dictionary = fs.readFileSync('/usr/share/dict/words', 'utf-8').toLowerCase().split('\n')

let count = 8
let underscores = []
let guessedLetters = []

app = express()

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('mst', mustacheExpress())
app.set('views', './templates')
app.set('view engine', 'mst')

function randomWord() {
  let i = Math.floor(Math.random() * dictionary.length)
  return dictionary[i]
}

let word = randomWord()

wordInPlay = word.split('')

function start() {
  for (var i = 0; i < word.length; i++) {
    underscores.push('_ ')
  }
}
start()

app.get('/', (req, res) => {
  res.render('index', { count: count, underscores: underscores, guessedLetters: guessedLetters, word: word })
})

app.post('/', (req, res) => {
  guessedLetters.push(req.body.guess)
  console.log(wordInPlay)
  for (var k = 0; k < wordInPlay.length; k++) {
    if (wordInPlay[k] === guessedLetters) {
      underscores.push(wordInPlay[k])
    } else count - 1
  }
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('there is life on 3000')
})
