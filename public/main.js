let screen = querySelector('.screen')

fetch('loser').then(response => response.text()).then(replacementHTML => {
  screen.innerHTML = replacementHTML
})

fetch('winner').then(response => response.text()).then(replacementHTML => {
  screen.innerHTML = replacementHTML
})
