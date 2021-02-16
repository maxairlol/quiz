'use strict';

import { loadQuestions, createChoice } from "./modules/app.js";

const gameElem = document.querySelector('.game');
const questionElem = document.querySelector('.questions-box__question');
const choicesElem = document.querySelector('.questions-box__choices');
const counterElem = document.getElementById('counter');
const scoreElem = document.getElementById('score');

let questions, userAnswers, score, currentQuestion, questionCounter, isAnswerSelected;

/*
* Functions
*/
const startGame = function () {
    userAnswers = [];
    score = 0;
    questionCounter = 0;
    currentQuestion = {};

    getQuestion();
    gameElem.classList.add('game--visible');
}

const getQuestion = function () {
    if (questionCounter === questions.length) {
       return endGame();
    }

    isAnswerSelected = false;
    currentQuestion = questions[questionCounter++];

    counterElem.textContent = `${questionCounter}/${questions.length}`;
    questionElem.textContent = currentQuestion.question;

    renderChoices();
}

const renderChoices = function () {
    choicesElem.innerHTML = '';

    for (const [i, choice] of currentQuestion.choices.entries()) {
        const choiceElem = createChoice(i, choice);

        choiceElem.dataset.number = i + 1;
        choiceElem.addEventListener('click', (e) => checkAnswer(e));

        choicesElem.append(choiceElem);
    }
}

const checkAnswer = function (e) {
    if (isAnswerSelected) return;

    const selectedChoice = e.currentTarget;
    const selectedAnswer = Number(selectedChoice.dataset['number']);
    let classToApply = 'questions-box__choice--incorrect';

    isAnswerSelected = true;
    userAnswers.push(selectedAnswer);

    if (selectedAnswer === currentQuestion.answer) {
        classToApply = 'questions-box__choice--correct';
        scoreElem.textContent = ++score;
    }

    selectedChoice.classList.add(classToApply);
    setTimeout(() => getQuestion(), 1000);
}

const endGame = function () {
    const progress = JSON.parse(localStorage.getItem('progress')) || [];
    const attempt = {
        answers: userAnswers,
        score: score
    };

    progress.push(attempt);

    localStorage.setItem('mostRecentScore', score);
    localStorage.setItem('numOfQuestions', questions.length);
    localStorage.setItem('progress', JSON.stringify(progress));

    return window.location.assign('end.html');
}

/*
* Execution
*/
loadQuestions()
  .then(responseQuestions => {
      questions = responseQuestions;
      startGame();
  })
  .catch(error => {
      alert(error);

      return window.location.assign('index.html');
  });
