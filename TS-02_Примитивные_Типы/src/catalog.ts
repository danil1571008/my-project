

const productNames: string[] = ["Смартфон", "Ноутбук", "Наушники", "Клавиатура", "Мышь"];

const prices: number[] = [45000, 89990.50, 5400.90, 3200, 1500.25];

const availability: boolean[] = [true, false, true, true, false];

type ProductRow = [string, number, boolean];

const productRows: ProductRow[] = [
    [productNames[0], prices[0], availability[0]],
    [productNames[1], prices[1], availability[1]],
    [productNames[2], prices[2], availability[2]],
    [productNames[3], prices[3], availability[3]],
    [productNames[4], prices[4], availability[4]]
];

const availableProducts = productRows.filter((row: ProductRow) => row[2] === true);

const productStrings = productRows.map((row: ProductRow) => `${row[0]} — ${row[1]} руб.`);

const totalAvailableSum = availableProducts.reduce((sum: number, row: ProductRow) => sum + row[1], 0);

function printStatistics(): void {

    console.log("=== Полный каталог ===", productStrings);
    console.log("=== Доступные товары ===", availableProducts);
    console.log(`Общая сумма доступных товаров: ${totalAvailableSum} руб.`);

  
    const container = document.getElementById("output-container");
    if (container) {
        container.innerHTML = `
            <h6><strong>Все товары каталога (обработка через map):</strong></h6>
            <ul class="list-group list-group-flush mb-3 small">
                ${productStrings.map(str => `<li class="list-group-item py-1">${str}</li>`).join('')}
            </ul>
            <h6><strong>Доступные позиции (обработка через filter):</strong></h6>
            <p class="small text-success mb-3">
                ${availableProducts.map(p => p[0]).join(', ')}
            </p>
            <h5 class="text-primary mb-0">Сумма доступных (обработка через reduce): ${totalAvailableSum.toFixed(2)} руб.</h5>
        `;
    }
}


function validateStringPrice(inputStr: string): string {
    const parsed = Number(inputStr);

    if (!Number.isFinite(parsed)) {
        return "Ошибка: Введенное значение не является конечным числом!";
    }
    if (parsed < 0) {
        return "Ошибка: Цена товара не может быть отрицательной!";
    }
    return `Успешно! Валидная цена: ${parsed} руб.`;
}

function throwCriticalError(msg: string): never {
    throw new Error(msg);
}


printStatistics();


const validateBtn = document.getElementById("validateBtn");
const priceInput = document.getElementById("stringPriceInput") as HTMLInputElement;
const validationResult = document.getElementById("validationResult");

if (validateBtn && priceInput && validationResult) {
    validateBtn.addEventListener("click", () => {
        const resultMessage = validateStringPrice(priceInput.value);
        validationResult.textContent = resultMessage;
        
  
        if (resultMessage.startsWith("Ошибка")) {
            validationResult.className = "mt-2 small fw-bold text-danger";
        } else {
            validationResult.className = "mt-2 small fw-bold text-success";
        }
    });
}

const neverBtn = document.getElementById("neverBtn");
if (neverBtn) {
    neverBtn.addEventListener("click", () => {
    
        throwCriticalError("Критический сбой приложения! Функция с типом возврата 'never' отработала успешно.");
    });
}
