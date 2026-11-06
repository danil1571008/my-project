
const productName: string = "Беспроводные наушники";
const pricePerUnit: number = 4500;
const quantity: number = 2;
const discountPercent: number = 10; 

const cardContainer = document.getElementById("order-card");


if (pricePerUnit < 0 || quantity < 1) {
    const errorMsg = "Ошибка: Неверные исходные значения (цена не может быть отрицательной, а количество меньше 1).";
    console.error(errorMsg);
    if (cardContainer) {
        cardContainer.innerHTML = `<div class="alert alert-danger mb-0">${errorMsg}</div>`;
    }
} else {
    
    const baseTotal = pricePerUnit * quantity;
    const total = baseTotal - (baseTotal * discountPercent) / 100;


    console.log(`Товар: ${productName}`);
    console.log(`Итоговая стоимость со скидкой ${discountPercent}%: ${total} руб.`);


    if (cardContainer) {
        cardContainer.innerHTML = `
            <p class="mb-2"><strong>Товар:</strong> <span>${productName}</span></p>
            <p class="mb-2"><strong>Цена за единицу:</strong> <span>${pricePerUnit} руб.</span></p>
            <p class="mb-2"><strong>Количество:</strong> <span>${quantity} шт.</span></p>
            <p class="mb-3"><strong>Скидка:</strong> <span class="text-success">${discountPercent}%</span></p>
            <hr>
            <h4 class="text-end text-primary mb-0">Итого: ${total} руб.</h4>
        `;
    }
}
