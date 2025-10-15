// All quotes
const quotes = [
  'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
  'There is nothing more deceptive than an obvious fact.',
  'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
  'I never make exceptions. An exception disproves the rule.',
  'What one man can invent another can discover.',
  'Nothing clears up a case so much as stating it to another person.',
  'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

// Game variables
let words = [];
let wordIndex = 0;
let startTime = 0;
let timerInterval;
let highScore = localStorage.getItem('highScore');

// Page elements
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');
const timerElement = document.getElementById('timer');
const highScoreElement = document.getElementById('high-score');

// Modal elements
const modal = document.getElementById('successModal');
const closeBtn = document.querySelector('.close');
const finalTime = document.getElementById('finalTime');
const bestScoreMsg = document.getElementById('bestScoreMsg');
const playAgainBtn = document.getElementById('playAgainBtn');

// Show existing high score
if (highScore) {
  highScoreElement.textContent = `Best Time: ${highScore}s`;
}

// Start button click event
startButton.addEventListener('click', () => {
  // Pick a random quote
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[quoteIndex];

  // Split into words
  words = quote.split(' ');
  wordIndex = 0;

  // Display words with span tags
  const spanWords = words.map(word => `<span>${word} </span>`);
  quoteElement.innerHTML = spanWords.join('');

  // Highlight first word
  quoteElement.childNodes[0].className = 'highlight';
  messageElement.innerText = '';

  // Reset and enable typing box
  typedValueElement.value = '';
  typedValueElement.disabled = false;
  typedValueElement.focus();
  typedValueElement.className = '';

  // Enable input listener
  typedValueElement.addEventListener('input', checkInput);

  // Reset and start timer
  clearInterval(timerInterval);
  startTime = Date.now();
  timerElement.textContent = 'Time: 0s';
  timerInterval = setInterval(updateTimer, 1000);
});

// Update timer every second
function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerElement.textContent = `Time: ${elapsed}s`;
}

// Input checking function
function checkInput() {
  const currentWord = words[wordIndex];
  const typedValue = typedValueElement.value;

  if (typedValue === currentWord && wordIndex === words.length - 1) {
    // End of quote
    clearInterval(timerInterval);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);

    // Disable typing and input listener
    typedValueElement.disabled = true;
    typedValueElement.removeEventListener('input', checkInput);

    // Show modal
    showSuccessModal(totalTime);

  } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
    // Correct word typed
    typedValueElement.value = '';
    wordIndex++;
    for (const wordElement of quoteElement.childNodes) {
      wordElement.className = '';
    }
    quoteElement.childNodes[wordIndex].className = 'highlight';
  } else if (currentWord.startsWith(typedValue)) {
    // Correct so far
    typedValueElement.className = '';
  } else {
    // Error
    typedValueElement.className = 'error';
  }
}

// Success modal logic
function showSuccessModal(timeTaken) {
  modal.style.display = 'block';
  finalTime.textContent = `Your Time: ${timeTaken}s`;

  if (!highScore || timeTaken < highScore) {
    localStorage.setItem('highScore', timeTaken);
    bestScoreMsg.textContent = 'New High Score!';
    highScoreElement.textContent = `Best Time: ${timeTaken}s`;
  } else {
    bestScoreMsg.textContent = `Best Time to Beat: ${highScore}s`;
  }
}

// Close or restart game
closeBtn.onclick = () => {
  modal.style.display = 'none';
  resetGame();
};

playAgainBtn.onclick = () => {
  modal.style.display = 'none';
  resetGame();
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    resetGame();
  }
};

// Reset to initial state
function resetGame() {
  startButton.disabled = false;
  typedValueElement.disabled = true;
  quoteElement.innerHTML = '';
  timerElement.textContent = 'Time: 0s';
  messageElement.textContent = '';
  typedValueElement.className = '';
}
