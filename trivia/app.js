const startButton = document.querySelector('.play-btn')
const retryButton = document.querySelector('.retry-btn')
const startContainer = document.querySelector('.start')
const gameContainer = document.querySelector('.game')
const questionElement = document.querySelector('.question')
const answerButtons = document.querySelector('.answer-block')
const finalContainer = document.querySelector('.final')
const blinker = document.querySelector('.blink')
const scoreNumber = document.querySelector('.score-number')
const finalScore = document.querySelector('.score-reveal')
let sassyText = document.querySelector('.sassytext')
let shuffledQuestions, currentQuestionIndex
let score = 0
let counter = 0

startButton.addEventListener('click', startGame)
retryButton.addEventListener('click', retryGame)

// LINKED WITH PLAY! BUTTON. TRANSITIONS FROM START SCREEN TO GAME SCREEN
// SETS CURRENTQUESTIONINDEX FROM UNDEFINED TO ZERO, SETS SCORE AND COUNTER TO ZERO
function startGame(){
  score = 0
  document.querySelector('.score-number').innerHTML = score;
  counter = 0
  currentQuestionIndex = 0
  startContainer.classList.add('hide')
  shuffledQuestions = questions.sort(() => Math.random() - .5)
  gameContainer.classList.remove('hide')
  setNextQuestion()
}

// LINKED WITH RETRY BUTTON ON FINALSCORE PAGE. INVOKES STARTGAME FUNCTION
function retryGame(){
  finalContainer.classList.add('hide')
  startGame()
}

//INVOKED TO PLACE QUESTION AND THEN AFTER TIMEOUT FROM SELECTING ANSWER TO EACH QUESTION. FOUND BELOW IN FRAME FUNCTION
function setNextQuestion(){
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

// REPLACES PREVIOUS QUESTION AND ANSWER BUTTONS FROM ARRAY OBJECT
// INVOKES selectAnswer FUNCTION ON CLICK
// INVOKES COUNTDOWN
function showQuestion(question){
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('answer-container')
    if(answer.correct){
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtons.appendChild(button)
  })
  countdown()
}

// INVOKES setStatusClass AND LINKS TO DATASET FROM ARRAY OBJECT TO ADD APPROPRIATE CLASS
// ADDS TO SCORE IF ANSWER IS CORRECT OR INVOKES showFinalScore FUNCTION IS COUNTER REACHES 10
function selectAnswer(e){
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  Array.from(answerButtons.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  if (selectedButton.dataset = correct) {
    score++
 }
  counter++
  if (counter > 9) {
    setTimeout(showFinalScore, 1000)
  }
  answerButtons.style.pointerEvents = 'none'
  currentQuestionIndex++
  setTimeout(setNextQuestion, 1000)
  document.querySelector('.score-number').innerHTML = score;
}

// ASSIGNS CLASS TO BUTTONS AFTER SELECTION OR END OF TIMER TO SHOW WHAT THE CORRECT ANSWER WAS
function setStatusClass(element, correct){
  clearStatusClass(element)
  if (correct){
    element.classList.add('correct')
  } else{
    element.classList.add('incorrect')
  }
}

// 10 SECOND TIMER BAR COUNTDOWN 
// frame FUNCTION WILL REVEAL CORRECT ANSWER AND DISALLOW POINTER EVENTS IF TIMER RUNS OUT
// WILL THEN INVOKE setNextQuestion OR showFinalScore DEPENDING ON PARAMETERS
let timer = 0;
function countdown() {
  if (timer == 0) {
    timer = 100
    const timerBar = document.querySelector(".timer-bar-full")
    let width = 100
    const timerInterval = setInterval(frame, 100)
    function timerYellow() {
      timerBar.classList.add('timer-yellow')
    }
    function timerRed() {
      timerBar.classList.add('timer-red')
    }
    function timerGreen() {
      timerBar.classList.add('timer-green')
    }
    function frame() {
      if (width <= 0) {
        clearInterval(timerInterval)
        timer = 0
        answerButtons.style.pointerEvents = 'none'
        Array.from(answerButtons.children).forEach(button => {
          setStatusClass(button, button.dataset.correct)
        })
        counter++
        if (counter > 9) {
          setTimeout(showFinalScore, 1000)
        }
        currentQuestionIndex++
        setTimeout(setNextQuestion, 1000)
        document.querySelector('.score-number').innerHTML = score;
      } else {
        width--
        timerBar.style.width = width + "%"
        timerBar.innerHTML = Math.floor(width  / 10)
        if (width < 20){
          timerRed()
        }
        else if (width < 40){
          timerYellow()
        }
      }
    }
  }
}

// INVOKED AFTER COUNTER HITS 10. WILL HIDE GAME, REVEAL SCORE, SNARKY MESSAGE, AND RETRY BUTTON
function showFinalScore(){
  finalContainer.classList.add('hide')
  gameContainer.classList.add('hide')
  document.querySelector('.final-score').innerHTML = score
  finalContainer.classList.remove('hide')
  typeWriter()
}

// BELOW TYPES OUT PREFIX TEXT ON FINAL RESULTS PAGE
// SCORE, ASSOCIATED SNARKY MESSAGE, AND RETRY BUTTON FOLLOW
let i = 0
const finalTxt = 'And your score is..'
const speed = 80

function typeWriter() {
  if (i < finalTxt.length) {
    document.getElementById("demo").innerHTML += finalTxt.charAt(i)
    i++;
    setTimeout(typeWriter, speed);
  }
  blinker.classList.remove('hide')
  setTimeout(function() {
    finalScore.classList.remove('hide')
  }, 3000)
  setTimeout(snarkyMessage, 4000)
  setTimeout(function() {
    retryButton.classList.remove('hide')
  }, 5000)
  
}

// PARAMETERS DETERMINE WHAT MESSAGE WILL SHOW UP ON FINAL SCREEN
function snarkyMessage(){
  const zero = 'oof...'
  const four = "That really... wasn't great. You should probably practice some more."
  const nine = "Pretty good, but you're not going to let Alex from HR show you up with their 10/10, are you?"
  const ten = 'Wow. You really know your stuff. If the trivia slack channel had a fridge door this would go right up on there.'
  sassyText.classList.remove('hide')
  if (score > 9) {
    sassyText.innerHTML = ten
  } else if (score > 4) {
    sassyText.innerHTML = nine
  } else if (score > 0) {
    sassyText.innerHTML =  four
  } else {
    sassyText.innerHTML = zero
  }
}


// CLEAR STYLING CLASSES FOR BUTTONS AFTER CORRECT ANSWER IS REVEALED
function clearStatusClass(element){
  element.classList.remove('correct')
  element.classList.remove('incorrect')
}

// REMOVES BUTTONS FROM PREVIOUS QUESTION SO NEW ELEMENTS CAN TAKE THEIR PLACE
function resetState(){
  while (answerButtons.firstChild){
    answerButtons.removeChild(answerButtons.firstChild)
  }
  answerButtons.style.pointerEvents = 'auto'
}

// ARRAY OBJECT CONTAINING ALL TRIVIA QUESTIONS AND ANSWERS
// INVOKED IN showQuestion WHICH IS INVOKED IN setNextQuestion
const questions = [
  {
    question: "What was Tandem's previous name?",
    answers: [
      {text: "Tandem", correct: false},
      {text: "Burger Shack", correct: false},
      {text: "Extraordinary Humans", correct: false},
      {text: "Devmynd", correct: true}
    ]
  },
  {
    question: "In Shakespeare's play Julius Caesar, Caesar's last words were...",
    answers: [
      {text: "Iacta alea est!", correct: false}, 
      {text: "Vidi, vini, vici", correct: false},
      {text: "Et tu, Brute?", correct: true}, 
      {text: "Aegri somnia vana", correct: false}
    ]
  },
  {
    question: "A group of tigers are referred to as:",
    answers: [
      {text: "Ambush", correct: true},
      {text: "Chowder", correct: false},
      {text: "Pride", correct: false},
      {text: "Destruction", correct: false}
    ]
  },
  {
    question: "What is the top speed an average cat can travel?",
    answers: [
      {text: "42 mph", correct: false},
      {text: "13 mph", correct: false},
      {text: "9 mph", correct: false},
      {text: "31 mph", correct: true}
    ]
  },
  {
    question: "A cat can jump to _____ times its own height:",
    answers: [
      {text: "3", correct: false},
      {text: "5", correct: true},
      {text: "9", correct: false},
      {text: "7", correct: false}
    ]
  },
  {
    question: "What is the only letter that doesn't appear in a US state name?",
    answers: [
      {text: "M", correct: false},
      {text: "Q", correct: true},
      {text: "Z", correct: false},
      {text: "X", correct: false}
    ]
  },
  {
    question: "What is the name for a cow-bison hybrid?",
    answers: [
      {text: "Beefalo", correct: true},
      {text: "Cowson", correct: false},
      {text: "Bicow", correct: false},
      {text: "Mooson", correct: false}
    ]
  },
  {
    question: "What is the largest freshwater lake in the world?",
    answers: [
      {text: "Lake Baikal", correct: false},
      {text: "Lake Michigan", correct: false},
      {text: "Lake Victoria", correct: false},
      {text: "Lake Superior", correct: true}
    ]
  },

  {
    question: "In a website address bar, what does WWW stand for?",
    answers: [
      {text: "Wild Wild West", correct: false},
      {text: "World Wide Web", correct: true},
      {text: "War World Web", correct: false}
    ]
  },
  {
    question: "In a game of bingo, what number is represented by the name two little ducks?",
    answers: [
      {text: "20", correct: false},
      {text: "55", correct: false},
      {text: "22", correct: true},
      {text: "77", correct: false}
    ]
  },
  {
    question: "According to Greek mythology, who was the first woman on Earth?",
    answers: [
      {text: "Pandora", correct: true},
      {text: "Lilith", correct: false},
      {text: "Eve", correct: false},
      {text: "Hera", correct: false}
    ]
  },
  {
    question: "In which European city would you find Orly airport?",
    answers: [
      {text: "London", correct: false},
      {text: "Belgium", correct: false},
      {text: "Munich", correct: false},
      {text: "Paris", correct: true}
    ]
  },
  {
    question: "Where would you find the Sea of Tranquility?",
    answers: [
      {text: "California", correct: false},
      {text: "The Moon", correct: true},
      {text: "Siberia", correct: false},
      {text: "China", correct: false}
    ]
  },
  {
    question: "Which artist painted 'Girl with a Pearl Earring'?",
    answers: [
      {text: "Van Gogh", correct: false},
      {text: "Vermeer", correct: true},
      {text: "Picasso", correct: false},
      {text: "Da Vinci", correct: false}
    ]
  },
  {
    question: "What is the official name for the 'hashtag' symbol?",
    answers: [
      {text: "Octothorpe", correct: true},
      {text: "Number sign", correct: false},
      {text: "Hash Sign", correct: false},
      {text: "Pound", correct: false}
    ]
  },
  {
    question: "Not American at all, where is apple pie from?",
    answers: [
      {text: "Japan", correct: false},
      {text: "Ethiopia", correct: false},
      {text: "Canada", correct: false},
      {text: "England", correct: true}
    ]
  },
  {
    question: "What is the national animal of Scotland?",
    answers: [
      {text: "Bear", correct: false},
      {text: "Rabbit", correct: false},
      {text: "Unicorn", correct: true},
      {text: "Seal", correct: false}
    ]
  },
  {
    question: "Where in the world is the only place where Canada is *due south*",
    answers: [
      {text: "Alaska", correct: false},
      {text: "Russia", correct: false},
      {text: "Washington", correct: false},
      {text: "Detroit", correct: true}
    ]
  },
  {
    question: "Approximately how many grapes go into a bottle of wine?",
    answers: [
      {text: "700", correct: true},
      {text: "500", correct: false},
      {text: "200", correct: false},
      {text: "1000", correct: false}
    ]
  },
  {
    question: "How much does a US One Dollar Bill cost to make?",
    answers: [
      {text: "$0.05", correct: true},
      {text: "$0.25", correct: false},
      {text: "$1", correct: false},
      {text: "$5", correct: false}
    ]
  },
  {
    question: "The Vatican bank has the only ATM in the world that allows users to do what?",
    answers: [
      {text: "Receive withdrawls in rosary beads", correct: false},
      {text: "Vote for the Pope", correct: false},
      {text: "Perform transactions in Latin", correct: true},
      {text: "Purchase indulgences", correct: false}
    ]
  }
]







  
