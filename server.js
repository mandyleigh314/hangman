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

  res.render('index', req.session)
})

app.post('/', (req, res) => {
  req.session.message = ''
  if (!req.session.guessedLetters) {
    req.session.guessedLetters = []
  }
  let guessedLetters = req.session.guessedLetters
  let guesses = req.session.guesses
  let underscores = req.session.underscores
  let guess = req.body.guess.toLowerCase()
  let regexp = /[^a-z]/

  if (guess.match(regexp)) {
    req.session.message = `${guess} is not a letter`
    res.redirect('/')
    return
  } else if (guessedLetters.includes(guess)) {
    req.session.message = 'You have already chosen that letter.'
    res.redirect('/')
    return
  } else if (req.session.wordInPlay.includes(guess)) {
    for (let k = 0; k < req.session.wordInPlay.length; k++) {
      if (req.session.wordInPlay[k] === guess) {
        req.session.underscores.splice(k, 1, guess)
      }
    }
  } else {
    req.session.count -= 1
    if (req.session.count === 0) {
      res.render('loser', req.session)
      return
    }
  }

  req.session.guessedLetters.push(guess)
  req.session.guesses = guessedLetters.slice('').join(' ')

  if (!underscores.includes('_')) {
    res.render('winner', req.session)
    return
  }
  res.redirect('/')
})

app.post('/reset', (req, res) => {
  req.session.word = null
  req.session.wordInPlay = null
  req.session.count = 8
  req.session.guessedLetters = null
  req.session.guesses = null
  req.session.underscores = null
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('there is life on 3000')
})
