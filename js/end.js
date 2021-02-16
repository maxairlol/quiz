'use strict';

const finalScoreElem = document.querySelector('.end-menu__final-score');
const percentageElem = document.querySelector('.end-menu__percentage');
const textElem = document.querySelector('.end-menu__text');

/*
 * Functions
 */
const displayResult = function () {
  const finalScore = localStorage.getItem('mostRecentScore');
  const numOfQuestions = localStorage.getItem('numOfQuestions');
  const percentage = finalScore / numOfQuestions;
  let text;

  if (percentage < 0.5) {
    text = 'You must study much harder!';
  } else if (percentage < 0.8) {
    text = 'Almost! Study a little more and take the test again!';
  } else {
    text = 'You can be proud of yourself!';
  }

  finalScoreElem.textContent = `${finalScore} of ${numOfQuestions}`;
  percentageElem.textContent = `${percentage * 100} %`;
  textElem.textContent = text;
};

/*
 * Execution
 */
displayResult();
