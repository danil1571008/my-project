interface OrderItem {
    id: number;
    title: string;
    unitPrice: number;
    quantity: number;
}

interface Order {
    id: number;
    customer: string;
    items: OrderItem[];
    discountPercent?: number;
}

type PriceFormatter = (value: number) => string;

const orders: Order[] = [
    {
        id: 101,
        customer: "Данил",
        items: [
            { id: 1, title: "Игровая мышь", unitPrice: 3500, quantity: 1 },
            { id: 2, title: "Коврик для мыши", unitPrice: 1200, quantity: 2 }
        ],
        discountPercent: 10
    },
    {
        id: 102,
        customer: "Алексей",
        items: [
            { id: 3, title: "Клавиатура", unitPrice: 6500, quantity: 1 },
            { id: 4, title: "Кабель HDMI", unitPrice: 800, quantity: 3 }
        ]
    },
    {
        id: 103,
        customer: "Иван",
        items: [
            { id: 5, title: "Монитор 27", unitPrice: 22000, quantity: 1 },
            { id: 6, title: "Гарнитура", unitPrice: 4500, quantity: 2 }
        ],
        discountPercent: 15
    }
];

function calculateItemTotal(item: OrderItem): number {
    return item.unitPrice * item.quantity;
}

function calculateSubtotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}

function applyDiscount(subtotal: number, percent: number = 0): number {
    if (percent < 0 || percent > 100) {
        throw new Error("Invalid discount percent");
    }
    return subtotal - (subtotal * percent) / 100;
}

function formatPrice(value: number, currency: string = "RUB"): string {
    return `${value.toFixed(2)} ${currency}`;
}

function formatOrder(order: Order, formatter: PriceFormatter = formatPrice): string {
    const subtotal = calculateSubtotal(order.items);
    const finalTotal = applyDiscount(subtotal, order.discountPercent);
    return `Заказ #${order.id} | Покупатель: ${order.customer} | Итого: ${formatter(finalTotal)}`;
}

function selectItems(items: OrderItem[], predicate: (item: OrderItem) => boolean): OrderItem[] {
    return items.filter(predicate);
}

type OrderPredicate = (order: Order) => boolean;

function selectOrders(ordersList: Order[], predicate: OrderPredicate): Order[] {
    return ordersList.filter(predicate);
}

function sumValues(...values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0);
}

function transformItems(items: OrderItem[], transformCallback: (item: OrderItem) => OrderItem): OrderItem[] {
    return items.map(transformCallback);
}

function getOrderDescription(id: number): string;
function getOrderDescription(code: string): string;
function getOrderDescription(value: number | string): string {
    if (typeof value === "number") {
        return `Заказ по ID числовому: ${value}`;
    } else {
        return `Заказ по строковому коду: ${value}`;
    }
}

interface OrderOptions {
    orderId: number;
    user: string;
    itemsCount: number;
}

function printOrderSummaryWithOptions(options: OrderOptions): string {
    return `Опции -> ID: ${options.orderId}, Клиент: ${options.user}, Позиций: ${options.itemsCount}`;
}

const allItems: OrderItem[] = orders.flatMap((o: Order) => o.items);

const expensiveItems: OrderItem[] = selectItems(allItems, (item: OrderItem) => item.unitPrice > 2000);
const multipleQuantityItems: OrderItem[] = selectItems(allItems, (item: OrderItem) => item.quantity > 1);

const productTitles: string[] = allItems.map((item: OrderItem) => item.title);

const searchItemId = 3;
const foundItem: OrderItem | undefined = allItems.find((item: OrderItem) => item.id === searchItemId);

const highDiscountOrders: Order[] = selectOrders(orders, (o: Order) => {
    const discount = o.discountPercent !== undefined ? o.discountPercent : 0;
    return discount > 5;
});

const discountedItemsCopy: OrderItem[] = transformItems(allItems, (item: OrderItem) => ({
    ...item,
    unitPrice: item.unitPrice * 0.9
}));

const sumZero = sumValues();
const sumOne = sumValues(450);
const sumMany = sumValues(10, 20, 30, 40);

const overloadNum = getOrderDescription(777);
const overloadStr = getOrderDescription("ORD-999");

const optionsCall = printOrderSummaryWithOptions({
    orderId: 505,
    user: "Мария",
    itemsCount: 4
});

console.log("=== Сводка заказов ===");
orders.forEach(o => console.log(formatOrder(o)));
console.log("Позиции дороже 2000:", expensiveItems);
console.log("Позиции количеством > 1:", multipleQuantityItems);
console.log("Все названия позиций:", productTitles);
if (foundItem) {
    console.log(`Найдена позиция ${searchItemId}:`, foundItem.title);
} else {
    console.log(`Позиция ${searchItemId} не найдена`);
}
console.log("Заказы со скидкой > 5%:", highDiscountOrders);
console.log("Суммы аргументов rest:", sumZero, sumOne, sumMany);
console.log("Перегрузка функций:", overloadNum, overloadStr);

const ordersContainer = document.getElementById("orders-summary-container");
if (ordersContainer) {
    ordersContainer.innerHTML = orders.map(o => `
        <div class="p-3 mb-2 bg-white rounded border">
            <h6 class="text-primary font-monospace mb-1">${formatOrder(o)}</h6>
            <div class="small text-muted">Позиций в чеке: ${o.items.length} шт.</div>
        </div>
    `).join('');
}

const extraContainer = document.getElementById("extra-tests-container");
if (extraContainer) {
    extraContainer.innerHTML = `
        <h6 class="fw-bold">Фильтрация по условию (Callback):</h6>
        <p class="small text-secondary mb-3">Дороже 2000: ${expensiveItems.map(i => i.title).join(", ")}</p>
        
        <h6 class="fw-bold">Работа Rest параметров (...values):</h6>
        <p class="small text-secondary mb-3">0 аргументов: ${sumZero} | Много: ${sumMany}</p>

        <h6 class="fw-bold">Перегрузка функций:</h6>
        <p class="small text-secondary mb-3">${overloadNum}<br>${overloadStr}</p>

        <h6 class="fw-bold">Передача объекта параметров:</h6>
        <p class="small text-success font-monospace" style="font-size:0.85rem;">${optionsCall}</p>
    `;
}
