export function calculateTotal(expensesList) {
    return expensesList.reduce((sum, item) => sum + item.amount, 0);
}

export function filterExpenses(expensesList, query) {
    const normalizedQuery = query.trim().toLowerCase();
    return expensesList.filter(item => 
        item.title.toLowerCase().includes(normalizedQuery)
    );
}

export function validateExpenseInput(title, amount) {
    if (!title || title.trim().length < 2) return false;
    if (isNaN(amount) || amount <= 0) return false;
    return true;
}
