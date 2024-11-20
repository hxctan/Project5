let Questions = [];
const ques = document.getElementById("ques");

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        if (!response.ok) {
            throw new Error(`Something went wrong!! Unable to fetch the data`);
        }
        const data = await response.json();
        Questions = data.results;
        loadQues();  // Load first question when data is ready
    } catch (error) {
        console.log(error);
        ques.innerHTML = `<h5 style='color: red'>${error}</h5>`;
    }
}

let currQuestion = 0;
let score = 0;

function loadQues() {
    if (Questions.length === 0) {
        ques.innerHTML = `<h5>Please Wait!! Loading Questions...</h5>`;
        return;
    }

    const opt = document.getElementById("opt");
    let currentQuestion = Questions[currQuestion].question;
    
    // Decode HTML entities
    currentQuestion = currentQuestion.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
    ques.innerText = currentQuestion;
    opt.innerHTML = "";

    const correctAnswer = Questions[currQuestion].correct_answer;
    const incorrectAnswers = Questions[currQuestion].incorrect_answers;
    const options = [correctAnswer, ...incorrectAnswers];
    options.sort(() => Math.random() - 0.5);

    options.forEach((option) => {
        option = option.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
        const choicesdiv = document.createElement("div");
        const choice = document.createElement("input");
        const choiceLabel = document.createElement("label");
        choice.type = "radio";
        choice.name = "answer";
        choice.value = option;
        choiceLabel.textContent = option;
        choicesdiv.appendChild(choice);
        choicesdiv.appendChild(choiceLabel);
        opt.appendChild(choicesdiv);
    });
}

function loadScore() {
    const totalScore = document.getElementById("score");
    totalScore.textContent = `You scored ${score} out of ${Questions.length}`;
    totalScore.innerHTML += "<h3>All Answers</h3>";
    Questions.forEach((el, index) => {
        totalScore.innerHTML += `<p>${index + 1}. ${el.correct_answer}</p>`;
    });
}

function nextQuestion() {
    if (currQuestion < Questions.length - 1) {
        currQuestion++;
        loadQues();
    } else {
        document.getElementById("opt").remove();
        document.getElementById("ques").remove();
        document.getElementById("btn").remove();
        loadScore();
    }
}

function checkAns() {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    if (!selectedAns) {
        alert("Please select an answer!");
        return;
    }

    const answer = selectedAns.value;
    if (answer === Questions[currQuestion].correct_answer) {
        score++;
    }
    nextQuestion();
}

// Reset the quiz to the first question
function resetQuiz() {
    currQuestion = 0;  // Reset to first question
    score = 0;         // Reset score
    const opt = document.getElementById("opt");

    // Ensure the options and question area are cleared
    opt.innerHTML = '';
    ques.innerHTML = '';  // Clear question text as well

    // Reload the first question
    loadQues();
}

// Trigger the reset function when the reset button is clicked
document.getElementById("resetButton").addEventListener("click", resetQuiz);

fetchQuestions();
