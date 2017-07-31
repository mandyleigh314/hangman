//Getting a random word
const word = dictionary => {
  const randIndex = Math.floor(Math.random() * dictionary.length)
  return dictionary[randIndex]
}
//Still need to break word down into letters, use split and join?

//Creating an array of dashes... how to remove commas?
let beginning = []
function start() {
  for (var i = 0; i < word.length; i++) {
    beginning.push('_ ')
  }
}

module.exports = start
module.exports = word
