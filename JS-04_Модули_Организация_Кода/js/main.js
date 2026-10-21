import { loadExpenses, saveExpenses } from './storage.js';
import { calculateTotal, filterExpenses, validateExpenseInput } from './expenses.js';
import { renderApp } from './render.js';

let state = {
    expenses: loadExpenses(),
    searchQuery: ''
};

const form = document.getElementById('expense-form');
const nameInput = document.getElementById('expense-name');
const sumInput = document.getElementById('expense-sum');
const listContainer = document.getElementById('expenses-list');
const totalAmountSpan = document.getElementById('total-amount');
const searchInput = document.getElementById('search-input');

function updateUI() {
    const filtered = filterExpenses(state.expenses, state.searchQuery);
    renderApp(filtered, listContainer, totalAmountSpan, handleDeleteExpense);
    totalAmountSpan.textContent = calculateTotal(state.expenses);
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = nameInput.value;
    const amount = Number(sumInput.value);

    if (!validateExpenseInput(title, amount)) {
        alert('Пожалуйста, введите корректное название и сумму больше 0!');
        return;
    }

    const newExpense = {
        id: Date.now().toString(),
        title: title.trim(),
        amount: amount
    };

    state.expenses.push(newExpense);
    saveExpenses(state.expenses);
    updateUI();
    form.reset();
});

function handleDeleteExpense(id) {
    state.expenses = state.expenses.filter(item => item.id !== id);
    saveExpenses(state.expenses);
    updateUI();
}

searchInput.addEventListener('input', (event) => {
    state.searchQuery = event.target.value;
    updateUI();
});

updateUI();
