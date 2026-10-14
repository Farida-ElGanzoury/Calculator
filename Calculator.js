// DOM

const equationLine = document.getElementById('equation');
const display = document.getElementById('display');
const keys = document.getElementById('keys');
const operatorButtons = document.querySelectorAll('[data-action="operator"]');

let current = '0';        
let previous = null;      
let operator = null;      
let overwrite = false;   
let lastEquation = '';   
const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };


// Logic

const calculate = (a, b, op) => {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b === 0 ? 'Error' : a / b;
        default:  return b;
    }
};

const buildEquation = () => {
    if (lastEquation) return lastEquation;
    if (operator === null) return '';
    return `${previous} ${symbols[operator]} ${overwrite ? '' : current}`;
};

const updateDisplay = () => {
    equationLine.textContent = buildEquation();   // equation (top)
    display.textContent = current;                // result (beneath)

    operatorButtons.forEach(btn => {
        btn.classList.toggle('active', overwrite && btn.dataset.value === operator);
    });
};

const inputDigit = (digit) => {
    if (overwrite || current === '0') {
        current = digit;
        overwrite = false;
    } else if (current.length < 12) {
        current += digit;
    }
    lastEquation = '';
};

const inputDecimal = () => {
    if (overwrite) {
        current = '0.';
        overwrite = false;
    } else if (!current.includes('.')) {
        current += '.';
    }
    lastEquation = '';
};

const compute = () => {
    if (operator === null || previous === null) return;

    const b = parseFloat(current);
    lastEquation = `${previous} ${symbols[operator]} ${b} =`;  

    const result = calculate(previous, b, operator);
    current = result === 'Error' ? 'Error' : String(parseFloat(result.toPrecision(10)));

    previous = null;
    operator = null;
    overwrite = true;
};

const chooseOperator = (op) => { 
    if (operator !== null && !overwrite) compute();

    previous = parseFloat(current);
    operator = op;
    overwrite = true;
    lastEquation = '';
};
 
const deleteLast = () => {
    if (overwrite) return;   
    current = current.slice(0, -1);
    if (current === '' || current === '-') current = '0';
};

const percent = () => {
    current = String(parseFloat(current) / 100);
};
 
const clearAll = () => {
    current = '0';
    previous = null;
    operator = null;
    overwrite = false;
    lastEquation = '';
};
 
const handleAction = (action, value) => {
    if (current === 'Error' && action !== 'clear') clearAll();

    switch (action) {
        case 'digit':     inputDigit(value);     break;
        case 'decimal':   inputDecimal();        break;
        case 'operator':  chooseOperator(value); break;
        case 'equals':    compute();             break;
        case 'backspace': deleteLast();          break;
        case 'percent':   percent();             break;
        case 'clear':     clearAll();            break;
    }
    updateDisplay();
};


// Events 

keys.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    handleAction(button.dataset.action, button.dataset.value);
});
 
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') handleAction('digit', e.key);
    else if (e.key === '.') handleAction('decimal');
    else if (['+', '-', '*', '/'].includes(e.key)) handleAction('operator', e.key);
    else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleAction('equals');
    }
    else if (e.key === 'Backspace') handleAction('backspace');
    else if (e.key === 'Escape') handleAction('clear');
});

updateDisplay();