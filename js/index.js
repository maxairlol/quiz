'use strict';

import * as app from "./modules/app.js";

const progressBtn = document.querySelector('.start-menu__progress-button');
const listElem = document.querySelector('.start-menu__list');
const modalElem = document.querySelector('.modal');
const modalBodyElem = document.querySelector('.modal__body');
const overlayElem = document.querySelector('.overlay');
const closeModalBtn = document.querySelector('.modal__close-btn');
const resultElem = document.querySelector('.result');

const progress = JSON.parse(localStorage.getItem('progress'));

/*
 * Functions
 */
const attachProgress = function () {
  if (!progress) return;

  progressBtn.classList.remove('button--disabled');

  for (let [i, attempt] of progress.entries()) {
    const numOfQuestions = localStorage.getItem('numOfQuestions');
    const listItem = app.createElement('li', 'start-menu__item');
    const attemptNumber = app.createElement('span', 'start-menu__item-num');
    const attemptText = document.createTextNode(`Result: ${attempt.score} of ${numOfQuestions}`);

    listItem.dataset.attempt = attemptNumber.textContent = i + 1;
    listItem.addEventListener('click', (e) => displayResult(e));

    listItem.append(attemptNumber, attemptText);
    listElem.appendChild(listItem);
  }
};

const displayResult = function (e) {
  const selectedAttempt = e.currentTarget;
  const attemptIndex = Number(selectedAttempt.dataset['attempt']) - 1;
  const userAnswers = progress[attemptIndex].answers;

  app.loadQuestions()
    .then((responseQuestions) => {
      renderResult(responseQuestions, userAnswers);
      openModal();
    })
    .catch((error) => alert(error));
};

const renderResult = function (questions, userAnswers) {
  resultElem.innerHTML = '';

  for (const [questionIndex, question] of questions.entries()) {
    const resultRowElem = app.createElement('div', 'result__row');
    const resultRowTitleElem = app.createElement('h3', 'result__row-title');
    const questionBoxElem = app.createElement('div', 'questions-box');
    const questionElem = app.createElement('h2', 'questions-box__question');

    const correctAnswer = question.answer - 1;
    const userAnswer = userAnswers[questionIndex] - 1;
    const choicesElem = createResultChoices(question, correctAnswer, userAnswer);

    resultRowTitleElem.textContent = `Question: ${questionIndex + 1}`;
    questionElem.textContent = question.question;

    questionBoxElem.append(questionElem, choicesElem);
    resultRowElem.append(resultRowTitleElem, questionBoxElem);
    resultElem.appendChild(resultRowElem);
  }
};

const createResultChoices = function (question, correctAnswer, userAnswer) {
  const choicesElem = app.createElement('div', 'questions-box__choices');

  for (const [choiceIndex, choice] of question.choices.entries()) {
    const choiceElem = app.createChoice(choiceIndex, choice);

    if (choiceIndex === correctAnswer) {
      choiceElem.classList.add('questions-box__choice--correct');
    }
    if (choiceIndex === userAnswer && correctAnswer !== userAnswer) {
      choiceElem.classList.add('questions-box__choice--incorrect');
    }

    choicesElem.classList.add('questions-box__choice--disabled');
    choicesElem.append(choiceElem);
  }

  return choicesElem;
};

const expandProgress = function () {
  this.classList.toggle('start-menu__progress-button--active');
  listElem.classList.toggle('start-menu__list--active');
};

const openModal = function () {
  modalElem.classList.remove('hidden');
  overlayElem.classList.remove('hidden');
};

const closeModal = function () {
  modalBodyElem.scrollTop = 0;
  modalElem.classList.add('hidden');
  overlayElem.classList.add('hidden');
};

/*
 * Events
 */
progressBtn.addEventListener('click', expandProgress);
closeModalBtn.addEventListener('click', closeModal);
overlayElem.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modalElem.classList.contains('hidden')) {
    closeModal();
  }
});

/*
 * Execution
 */
attachProgress();
