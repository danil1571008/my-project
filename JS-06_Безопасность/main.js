const STORAGE_KEY = 'secure_calories_tracker_data';

// --- 1. Безопасная загрузка и валидация структуры localStorage ---
function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        // Проверяем, что каждый элемент внутри массива — это правильный объект, а не хакерский лог
        return parsed.filter(item => 
            item &&
            typeof item === 'object' &&
            typeof item.id === 'string' &&
            typeof item.name === 'string' &&
            typeof item.calsPer100g === 'number' && !isNaN(item.calsPer100g) &&
            typeof item.weightGrams === 'number' && !isNaN(item.weightGrams) &&
            typeof item.totalCals === 'number' && !isNaN(item.totalCals)
        );
    } catch (e) {
        console.error("Ошибка чтения localStorage:", e);
        showError("Данные локального хранилища повреждены и были сброшены.");
        localStorage.removeItem(STORAGE_KEY);
        return [];
    }
}

// --- 2. Сохранение ---
function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        showError("Не удалось сохранить запись в память браузера.");
    }
}

let foodList = loadData();

// --- 3. Валидация входных данных (Бизнес-требования) ---

function validateFoodName(name) {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
        return { isValid: false, error: "Название блюда слишком короткое (минимум 2 символа)." };
    }
    if (trimmed.length > 40) {
        return { isValid: false, error: "Название блюда слишком длинное (максимум 40 символов)." };
    }
    return { isValid: true, sanitized: trimmed };
}

function validateNumericInput(value, min, max, fieldName) {
    // Проверяем на пустую строку или пробелы
    if (!value.trim()) {
        return { isValid: false, error: `Поле "${fieldName}" не должно быть пустым.` };
    }
    
    // Преобразуем строго в число и проверяем, что это не NaN и не infinity
    const num = Number(value);
    if (isNaN(num) || !isFinite(num)) {
        return { isValid: false, error: `В поле "${fieldName}" нужно ввести корректное число.` };
    }
    
    // Проверка бизнес-границ (например, калорийность не может быть 99999 ккал)
    if (num < min || num > max) {
        return { isValid: false, error: `Значение "${fieldName}" должно быть в диапазоне от ${min} до ${max}.` };
    }
    
    return { isValid: true, parsedValue: num };
}

// --- 4. Логика интерфейса и вывода (Защита от XSS) ---

const errorBlock = document.getElementById('errorBlock');
const foodContainer = document.getElementById('foodContainer');
const totalCaloriesBadge = document.getElementById('totalCaloriesBadge');
const foodForm = document.getElementById('foodForm');

function showError(message) {
    errorBlock.textContent = message; // textContent безопасен, теги внутри строки не сработают
    errorBlock.classList.remove('d-none');
}

function hideError() {
    errorBlock.classList.add('d-none');
    errorBlock.textContent = '';
}

function render() {
    foodContainer.innerHTML = '';
    let grandTotalCals = 0;

    if (foodList.length === 0) {
        foodContainer.innerHTML = '<div class="text-muted text-center py-3">Вы сегодня еще ничего не добавили.</div>';
        totalCaloriesBadge.textContent = 'Итого: 0 ккал';
        return;
    }

    foodList.forEach(item => {
        grandTotalCals += item.totalCals;

        // Создаем элементы через API DOM вместо опасного innerHTML
        const row = document.createElement('div');
        row.className = 'border-bottom py-2 d-flex justify-content-between align-items-center';

        const infoDiv = document.createElement('div');
        
        // Название блюда выводим как текст (скрипты не исполнятся)
        const nameSpan = document.createElement('span');
        nameSpan.className = 'fw-bold d-block';
        nameSpan.textContent = item.name; 
        
        const detailsSpan = document.createElement('span');
        detailsSpan.className = 'text-muted small';
        detailsSpan.textContent = `${item.weightGrams}г × ${item.calsPer100g} ккал/100г`;

        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(detailsSpan);

        const rightDiv = document.createElement('div');
        rightDiv.className = 'd-flex align-items-center';

        const calsSpan = document.createElement('span');
        calsSpan.className = 'badge bg-secondary me-3';
        calsSpan.textContent = `+${item.totalCals} ккал`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-outline-danger';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = function() {
            deleteItem(item.id);
        };

        rightDiv.appendChild(calsSpan);
        rightDiv.appendChild(deleteBtn);

        row.appendChild(infoDiv);
        row.appendChild(rightDiv);
        foodContainer.appendChild(row);
    });

    totalCaloriesBadge.textContent = `Итого: ${Math.round(grandTotalCals)} ккал`;
}

function deleteItem(id) {
    foodList = foodList.filter(item => item.id !== id);
    saveData(foodList);
    render();
}

// --- 5. Обработка отправки данных формы ---

foodForm.addEventListener('submit', function(e) {
    e.preventDefault();
    hideError();

    const rawName = document.getElementById('foodName').value;
    const rawCalories = document.getElementById('calories').value;
    const rawWeight = document.getElementById('weight').value;

    // Проверка 1: Название
    const nameCheck = validateFoodName(rawName);
    if (!nameCheck.isValid) {
        showError(nameCheck.error);
        return;
    }

    // Проверка 2: Число калорий (бизнес-логика: от 1 до 900 ккал на 100г)
    const caloriesCheck = validateNumericInput(rawCalories, 1, 900, "Калории");
    if (!caloriesCheck.isValid) {
        showError(caloriesCheck.error);
        return;
    }

    // Проверка 3: Вес порции (бизнес-логика: от 1 до 2000 грамм)
    const weightCheck = validateNumericInput(rawWeight, 1, 2000, "Вес порции");
    if (!weightCheck.isValid) {
        showError(weightCheck.error);
        return;
    }

    // Математический расчет на основе проверенных валидных чисел
    const calculatedCals = Math.round((caloriesCheck.parsedValue * weightCheck.parsedValue) / 100);

    // Сборка объекта
    const newFoodItem = {
        id: Date.now().toString(),
        name: nameCheck.sanitized,
        calsPer100g: caloriesCheck.parsedValue,
        weightGrams: weightCheck.parsedValue,
        totalCals: calculatedCals
    };

    foodList.push(newFoodItem);
    saveData(foodList);
    render();

    // Форма сбрасывается ТОЛЬКО при успехе
    foodForm.reset();
});

// Стартовый рендер сохраненных данных
render();
