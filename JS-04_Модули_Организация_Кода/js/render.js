function createExpenseItemHTML(expense, onDeleteClick) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center px-0';
    
    li.innerHTML = `
        <div>
            <span class="fw-semibold">${expense.title}</span>
        </div>
        <div class="d-flex align-items-center gap-3">
            <span class="badge bg-danger rounded-pill fs-6">${expense.amount} ₽</span>
            <button class="btn btn-sm btn-outline-danger delete-btn">&times;</button>
        </div>
    `;

    li.querySelector('.delete-btn').addEventListener('click', () => {
        onDeleteClick(expense.id);
    });

    return li;
}

export function renderApp(expenses, containerElement, totalElement, onDeleteClick) {
    containerElement.innerHTML = '';

    if (expenses.length === 0) {
        containerElement.innerHTML = '<li class="text-muted text-center py-3">Расходов пока нет</li>';
    } else {
        expenses.forEach(expense => {
            const itemHTML = createExpenseItemHTML(expense, onDeleteClick);
            containerElement.appendChild(itemHTML);
        });
    }
}
