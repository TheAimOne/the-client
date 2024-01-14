const baseUrl = 'http://localhost:8080';

function getBaseUrl() {
    return baseUrl;
}


function createButton({ id, text, styleClassName }) {
    const div  = document.createElement("div");

    const button = document.createElement("button");
    button.id = id;
    button.textContent = text;
    div.appendChild(button);
    div.className = styleClassName;

    return { div, button };
}

function createLabel({ id, text, styleClassName }) {
    const input = document.createElement("label");
    input.id = id;
    input.textContent = text;
    input.className = styleClassName;

    return input;
}

function createInput({ id, text, type }) {
    const div  = document.createElement("div");

    const input = document.createElement("input");
    input.id = id;
    input.placeholder = text;

    if (type) {
        input.type = type;
    }

    div.appendChild(input);

    return { div, input };
}

function createLabelAndInput(arg) {
    const label = createLabel(arg.label);
    const labelDiv = document.createElement('div');
    labelDiv.className = "labelName";
    labelDiv.append(label);


    const input = createInput(arg.input);

    const inputDiv = document.createElement('div');
    inputDiv.className = "inputValue";
    inputDiv.append(input.input);
    
    const div = document.createElement('div');
    div.className = "outer"

    div.append(labelDiv);
    div.append(inputDiv);

    return div;
}

function combineInputAndLabel(array) {
    const div = document.createElement('div');

    for (let i = 0; i < array.length; i++) {
        div.append(array[i]);
    }

    return div;
}

function clearPage(app) {
    while (app.lastElementChild) {
        app.removeChild(app.lastElementChild);
    }
}

function createTableHeading(table, headingArr) {
    const trHeading = document.createElement('tr');

    for (let i = 0; i < headingArr.length; i++) {
        const element = headingArr[i];
        const th = document.createElement('th');
        th.textContent = element;
        th.className = 'thLabel';
        trHeading.appendChild(th);
    }

    table.append(trHeading);
}

function createTableRow(textArr) {
    const row = document.createElement('tr');

    for (let i = 0; i < textArr.length; i++) {
        const element = textArr[i];
        const td = document.createElement('td');
        td.textContent = element;
        row.appendChild(td);
    }

    return row;
}

module.exports = {
    createButton,
    createLabel,
    createInput,
    createLabelAndInput,
    combineInputAndLabel,
    clearPage,
    createTableHeading,
    createTableRow,
    getBaseUrl,
};
