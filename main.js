const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const fs = require('fs')
const expressSession = require('express-session')
const dictionary = fs.readFileSync('/usr/share/dict/words', 'utf-8').toLowerCase().split('\n')

app = express()

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  expressSession({
    secret: 'Keyboard Cat',
    resave: false,
    saveUninitialized: true
  })
)

app.engine('mst', mustacheExpress())
app.set('views', './templates')
app.set('view engine', 'mst')

app.get('/', (req, res) => {
  if (!req.session.word) {
    function randomWord() {
      let i = Math.floor(Math.random() * dictionary.length)
      return dictionary[i]
    }

    req.session.word = randomWord()
    let word = req.session.word
    let wordInPlay = req.session.wordInPlay

    req.session.wordInPlay = req.session.word.split('')

    if (!req.session.underscores) {
      req.session.underscores = []
    }

    let underscores = req.session.underscores

    function start() {
      for (var i = 0; i < word.length; i++) {
        req.session.underscores.push('_')
      }
    }
    start()
    req.session.count = 8
  }

  let guessedLetters = req.session.guessedLetters
  let guesses = req.session.guesses
  let message = req.session.message

  res.render('index', {
    count: req.session.count,
    underscores: req.session.underscores,
    guessedLetters: req.session.guessedLetters,
    guesses: req.session.guesses,
    word: req.session.word,
    message: req.session.message
  })
})

app.post('/', (req, res) => {
  req.session.message = ''
  if (!req.session.guessedLetters) {
    req.session.guessedLetters = []
  }
  let guessedLetters = req.session.guessedLetters
  let guesses = req.session.guesses
  let underscores = req.session.underscores

  if (guessedLetters.includes(req.body.guess)) {
    message = 'You have already chosen that letter.'
    res.redirect('/')
    return
  } else if (req.session.wordInPlay.includes(req.body.guess)) {
    for (let k = 0; k < req.session.wordInPlay.length; k++) {
      if (req.session.wordInPlay[k] === req.body.guess) {
        req.session.underscores.splice(k, 1, req.body.guess)
      }
    }
  } else {
    req.session.count -= 1
    if (req.session.count === 0) {
      res.render('loser', {
        count: req.session.count,
        underscores: req.session.underscores,
        guesses: req.session.guesses,
        word: req.session.word
      })
      return
    }
  }

  req.session.guessedLetters.push(req.body.guess)
  req.session.guesses = guessedLetters.slice('').join(' ')

  if (!underscores.includes('_')) {
    res.render('winner', {
      count: req.session.count,
      underscores: req.session.underscores,
      guesses: req.session.guesses,
      word: req.session.word
    })
    return
  }
  res.redirect('/')
})

app.post('/reset', (req, res) => {
  req.session.word = null
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('there is life on 3000')
})
