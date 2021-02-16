const loadQuestions = async function () {
    const response = await fetch('quiz.json');

    if (!response.ok) throw new Error(`An error has occured: ${response.status}`);

    return await response.json();
}

const createChoice = function (characterIndex, text) {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const choiceElem = createElement('div', 'questions-box__choice');
    const choicePrefixElem = createElement('p', 'questions-box__choice-prefix');
    const choiceTextElem = createElement('p', 'questions-box__choice-text');

    choicePrefixElem.textContent = characters.charAt(characterIndex);
    choiceTextElem.textContent = text;
    choiceElem.append(choicePrefixElem, choiceTextElem);

    return choiceElem;
}

const createElement = function (tagName, className = '') {
    const element = document.createElement(tagName);
    element.className = className;

    return element;
}

export { loadQuestions, createChoice, createElement };
