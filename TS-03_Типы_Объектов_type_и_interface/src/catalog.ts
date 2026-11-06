interface Contacts {
    email?: string; 
    phone?: string; 
}


interface Supplier {
    name: string;
    country: string;
    contacts?: Contacts; 
}

type ProductId = string;


interface Product {
    readonly id: ProductId; 
    name: string;
    category: string;
    price: number;
    isAvailable: boolean;
    tags: string[];
    supplier: Supplier;  
    description?: string;
}

const products: Product[] = [
    {
        id: "P001",
        name: "Игровой монитор 27'",
        category: "Электроника",
        price: 24990,
        isAvailable: true,
        tags: ["gaming", "4k", "ips"],
        description: "Шикарный игровой монитор с частотой 144 Гц.", 
        supplier: { name: "Asus Tech", country: "Тайвань", contacts: { email: "support@asus.com" } } 
    },
    {
        id: "P002",
        name: "Механическая клавиатура",
        category: "Периферия",
        price: 6500,
        isAvailable: false, 
        tags: ["rgb", "red-switches"],
        supplier: { name: "Keychron LLC", country: "Китай" } 
    },
    {
        id: "P003",
        name: "Беспроводная мышь",
        category: "Периферия",
        price: 3990,
        isAvailable: true,
        tags: ["wireless", "office"],
        description: "Удобная мышка для работы в офисе.",
        supplier: { name: "Logitech", country: "Швейцария", contacts: { phone: "+41-22-111-22-33" } } 
    },
    {
        id: "P004",
        name: "Процессор Core i5",
        category: "Комплектующие",
        price: 18200,
        isAvailable: true,
        tags: ["intel", "cpu", "6-cores"],
        supplier: { name: "Intel Corp", country: "США", contacts: { email: "info@intel.com", phone: "+1-800-INTEL" } }
    },
    {
        id: "P005",
        name: "Оперативная память 16GB",
        category: "Комплектующие",
        price: 5200,
        isAvailable: true,
        tags: ["ddr4", "ram"],
        supplier: { name: "Kingston", country: "США" } 
    },
    {
        id: "P006",
        name: "Коврик для мыши XL",
        category: "Периферия",
        price: 1200,
        isAvailable: false,
        tags: ["mousepad", "cloth"],
        description: "Большой ковер на весь стол.",
        supplier: { name: "CustomPads", country: "Россия", contacts: { email: "sales@custompads.ru" } }
    }
];


const availableProducts = products.filter(product => product.isAvailable);
console.log("Доступные товары (Пункт 5):", availableProducts);

const productNamesArray: string[] = products.map(product => product.name);

const searchId = "P003";
const foundProduct = products.find(product => product.id === searchId);


if (foundProduct) {
    foundProduct.price = 4200; 
}
interface DigitalProduct extends Product {
    downloadUrl: string;
    fileSizeMb: number;
}


const steamGame: DigitalProduct = {
    id: "DIG01",
    name: "Cyberpunk 2077 Key",
    category: "Игры",
    price: 1999,
    isAvailable: true,
    tags: ["rpg", "steam", "open-world"],
    downloadUrl: "https://steam.com",
    fileSizeMb: 75000,
    supplier: { name: "CD Projekt", country: "Польша" }
};

const excessObject = {
    id: "P007",
    name: "Внешний SSD",
    category: "Накопители",
    price: 8900,
    isAvailable: true,
    tags: ["ssd", "usb-c"],
    extraSecretKey: "12345-X-XYZ", 
    supplier: { name: "Samsung", country: "Корея" }
};

const safeProduct: Product = excessObject; 

interface OfficeBranch {
    branchId: string;
    address: string;
    mainSupplier: Supplier;
}

function renderCatalog() {
    const catalogContainer = document.getElementById("catalog-container");
    if (!catalogContainer) return;

    catalogContainer.innerHTML = products.map(p => `
        <div class="card mb-3 border-secondary">
            <div class="card-body py-2">
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="mb-1 text-dark fw-bold">[${p.id}] ${p.name}</h6>
                    <span class="badge ${p.isAvailable ? 'bg-success' : 'bg-danger'}">${p.isAvailable ? 'В наличии' : 'Нет'}</span>
                </div>
                <p class="mb-1 small text-muted">Категория: ${p.category} | Цена: <strong>${p.price} руб.</strong></p>
                
                <!-- 9. Обрабатываем необязательное описание: выводим только если оно реально есть -->
                ${p.description ? `<p class="mb-1 text-secondary bg-white p-1 rounded border" style="font-size: 0.85rem;">📝 ${p.description}</p>` : ''}
                
                <div class="mt-2 p-2 bg-light rounded" style="font-size: 0.8rem;">
                    <strong>Поставщик:</strong> ${p.supplier.name} (${p.supplier.country})<br>
                    <!-- 10. Корректный безопасный доступ к вложенным контактам и email -->
                    ${p.supplier.contacts ? `
                        ${p.supplier.contacts.email ? `📧 Email: ${p.supplier.contacts.email}` : ''}
                        ${p.supplier.contacts.phone ? ` 📞 Тел: ${p.supplier.contacts.phone}` : ''}
                    ` : '<span class="text-muted">Контакты не указаны</span>'}
                </div>
            </div>
        </div>
    `).join('');
}

function renderOperations() {
    const operationsContainer = document.getElementById("operations-container");
    if (!operationsContainer) return;

    console.log("=== Лог существующих описаний (Пункт 9) ===");
    products.forEach(p => {
        if (p.description !== undefined) {
            console.log(`Товар ${p.id}: ${p.description}`);
        }
    });

    operationsContainer.innerHTML = `
        <h6><strong>1. Доступные товары (filter):</strong></h6>
        <p class="small text-success">${availableProducts.map(p => p.name).join(', ')}</p>
        <hr>
        <h6><strong>2. Все названия (map - string[]):</strong></h6>
        <p class="small text-dark text-truncate">${productNamesArray.join(', ')}</p>
        <hr>
        <h6><strong>3. Поиск товара P003 (find):</strong></h6>
        ${foundProduct ? `
            <div class="p-2 bg-white rounded border small">
                Найдено: <strong>${foundProduct.name}</strong><br>
                Новая цена: ${foundProduct.price} руб.
            </div>
        ` : '<p class="text-danger small">Товар не найден</p>'}
    `;
}

function renderExtraParts() {
    const extraContainer = document.getElementById("extra-container");
    if (!extraContainer) return;

    extraContainer.innerHTML = `
        <h6><strong>Цифровой товар (DigitalProduct):</strong></h6>
        <div class="p-2 bg-white rounded border small mb-2">
            Имя: ${steamGame.name}<br>
            Размер: ${steamGame.fileSizeMb} МБ<br>
            Ссылка: <a href="${steamGame.downloadUrl}" target="_blank" class="text-decoration-none">Скачать</a>
        </div>
        <h6><strong>Обход проверки литерала (Доп. 3):</strong></h6>
        <p class="small text-muted mb-0">Объект с лишним свойством <code>extraSecretKey</code> успешно присвоен в переменную типа <code>Product</code>.</p>
    `;
}

renderCatalog();
renderOperations();
renderExtraParts();
