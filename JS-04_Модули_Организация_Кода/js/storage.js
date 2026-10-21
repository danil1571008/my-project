const STORAGE_KEY = 'my_expenses_data';

export function loadExpenses() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
        return [];
    }
    try {
        const parsed = JSON.parse(rawData);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Данные в localStorage повреждены:", error);
        return [];
    }
}

export function saveExpenses(expenses) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}
