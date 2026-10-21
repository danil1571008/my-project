// JS-OPT: оптимизация обработки данных
// Меняйте только функции с суффиксом Optimised. Остальной код проверяет результаты и измеряет время

const PRODUCT_COUNT = 12000;
const STATUSES = ['new', 'processing', 'shipped', 'cancelled'];
const CATEGORIES = Array.from({ length: 12 }, (_, index) => 'category-' + index);


const products = Array.from({ length: PRODUCT_COUNT }, (_, index) => ({
  id: index + 1,
  category: 'category-' + (index % CATEGORIES.length),
  price: 100 + ((index * 17) % 10000),
  title: 'Product ' + (index + 1)
}));

// Два товара имеют одинаковую максимальную цену. При равенстве нужно вернуть первый
products[119].price = 99999;
products[899].price = 99999;

// В списке есть повторяющиеся и отсутствующие ID
const selectedIds = Array.from({ length: 650 }, (_, index) =>
  1 + ((index * 37) % 4200)
);
selectedIds.push(...selectedIds.slice(0, 80), PRODUCT_COUNT + 1, PRODUCT_COUNT + 999);

// Есть повторные запросы и ID, которых нет в products
const idsToLookup = Array.from({ length: 700 }, (_, index) =>
  index % 11 === 0
    ? PRODUCT_COUNT + 500 + index
    : 1 + ((index * 41) % PRODUCT_COUNT)
);
idsToLookup[30] = idsToLookup[1];
idsToLookup[90] = idsToLookup[4];

// Большое количество повторов, но порядок первого появления должен сохраниться
const codes = Array.from({ length: 8000 }, (_, index) => 'code-' + ((index * 17) % 700));
codes[5] = 'Ab-12';
codes[15] = 'ab-12';
codes[25] = 'Ab-12';

// В заказах встречаются и неизвестные статусы. Они не должны попадать в сводку известных статусов
const orders = Array.from({ length: 40000 }, (_, index) => ({
  id: index + 1,
  status: index % 101 === 0 ? 'returned' : STATUSES[index % STATUSES.length],
  amount: 100 + ((index * 13) % 900)
}));

// ЗАДАНИЕ 1. Найти только первый товар с нужным ID
function findProductByIdSlow(items, targetId) {
  return items.find(item => item.id === targetId)[0];
}

function findProductByIdOptimised(items, targetId) {
  // Изменить реализацию. Сохранить результат для найденного и отсутствующего ID
  return items.find(item => item.id === targetId);
}

// ЗАДАНИЕ 2. Оставить товары, ID которых присутствует в списке ids
function filterSelectedProductsSlow(items, ids) {
  return items.filter(item => ids.includes(item.id));
}

function filterSelectedProductsOptimised(items, ids) {
  // В списке ids есть повторы и отсутствующие ID. Не меняйть порядок исходных товаров
    const idSet = new Set(ids);
    return items.filter(item => idSet.has(item.id));
}

// ЗАДАНИЕ 3. Удалить повторяющиеся значения, сохранив порядок первого появления
function uniqueCodesSlow(values) {
  const result = [];
  for (const value of values) {
    if (!result.includes(value)) {
      result.push(value);
    }
  }
  return result;
}

function uniqueCodesOptimised(values) {
  // Сократить стоимость проверки повторов. Сравнение должно оставаться точным
  const seen = new Set();
  const result = [];
  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }
  return result;
}

// ЗАДАНИЕ 4. Получить товары по массиву ID. ID могут повторяться или отсутствовать
function lookupProductsSlow(items, ids) {
  return ids.map(id => items.find(item => item.id === id));
}

function lookupProductsOptimised(items, ids) {
  // Одни и те же товары используются для большого количества запросов
    const byId = new Map();
  for (const item of items) byId.set(item.id, item);
  return ids.map(id => byId.get(id));

}

// ЗАДАНИЕ 5. Для каждого известного статуса посчитать количество заказов и общую сумму amount
function countByStatusSlow(items) {
  return STATUSES.map(status => {
    const group = items.filter(item => item.status === status);
    return {
      status,
      count: group.length,
      totalAmount: group.reduce((sum, item) => sum + item.amount, 0)
    };
  });
}

function countByStatusOptimised(items) {
  // Требуется получить ту же структуру результата, желательно за один проход по заказам
 const stats = new Map();
  for (const item of items) {
    let entry = stats.get(item.status);
    if (!entry) {
      entry = { count: 0, totalAmount: 0 };
      stats.set(item.status, entry);
    }
    entry.count += 1;
    entry.totalAmount += item.amount;
  }
  return STATUSES.map(status => {
    const entry = stats.get(status) || { count: 0, totalAmount: 0 };
    return {
      status,
      count: entry.count,
      totalAmount: entry.totalAmount
    };
  });
}

// ЗАДАНИЕ 6. Найти самый дорогой товар, не изменяя исходный массив
function mostExpensiveProductSlow(items) {
  return items.slice().sort((a, b) => b.price - a.price)[0];
}

function mostExpensiveProductOptimised(items) {
  // Не сортировать весь массив. При равных ценах вернуть товар, который встречается раньше
   let best = items[0];
  for (let i = 1; i < items.length; i++) {
    if (items[i].price > best.price) best = items[i];
  }
  return best;
}

// ЗАДАНИЕ 7. Для каждой категории посчитать количество, сумму, среднюю, минимальную и максимальную цену
function categorySummarySlow(items) {
  return CATEGORIES.map(category => {
    const group = items.filter(item => item.category === category);
    const totalPrice = group.reduce((sum, item) => sum + item.price, 0);
    const minPrice = group.reduce((min, item) => Math.min(min, item.price), Infinity);
    const maxPrice = group.reduce((max, item) => Math.max(max, item.price), -Infinity);

    return {
      category,
      count: group.length,
      totalPrice,
      averagePrice: group.length ? totalPrice / group.length : 0,
      minPrice: group.length ? minPrice : 0,
      maxPrice: group.length ? maxPrice : 0
    };
  });
}

function categorySummaryOptimised(items) {
  // Обновлять показатели категорий по мере обхода массива
  const stats = new Map();
  for (const item of items) {
    let entry = stats.get(item.category);
    if (!entry) {
      entry = { count: 0, totalPrice: 0, minPrice: Infinity, maxPrice: -Infinity };
      stats.set(item.category, entry);
    }
    entry.count += 1;
    entry.totalPrice += item.price;
    if (item.price < entry.minPrice) entry.minPrice = item.price;
    if (item.price > entry.maxPrice) entry.maxPrice = item.price;
  }
  return CATEGORIES.map(category => {
    const entry = stats.get(category);
    if (!entry || entry.count === 0) {
      return { category, count: 0, totalPrice: 0, averagePrice: 0, minPrice: 0, maxPrice: 0 };
    }
    return {
      category,
      count: entry.count,
      totalPrice: entry.totalPrice,
      averagePrice: entry.totalPrice / entry.count,
      minPrice: entry.minPrice,
      maxPrice: entry.maxPrice
    };
  });
}

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

function assertSame(expected, actual, description) {
  if (!deepEqual(expected, actual)) {
    throw new Error('Результаты отличаются: ' + description);
  }
}

function median(numbers) {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function benchmark(fn, args, repetitions) {
  // Один прогревочный запуск серии
  for (let index = 0; index < repetitions; index++) fn(...args);

  const times = [];
  for (let round = 0; round < 5; round++) {
    const start = Date.now();
    for (let index = 0; index < repetitions; index++) {
      fn(...args);
    }
    const elapsed = Date.now() - start;
    times.push(elapsed / repetitions);
  }
  return { times, median: median(times) };
}

function compareTask(title, slowFn, optimisedFn, args, repetitions, edgeCases = []) {
  console.log('\n' + '='.repeat(66));
  console.log(title);

  const expected = slowFn(...args);
  const actual = optimisedFn(...args);
  assertSame(expected, actual, title);

  for (let index = 0; index < edgeCases.length; index++) {
    const caseArgs = edgeCases[index];
    assertSame(slowFn(...caseArgs), optimisedFn(...caseArgs), title + ', проверка ' + (index + 1));
  }
  console.log('Проверка результатов: OK (основной пример и дополнительные случаи: ' + edgeCases.length + ')');

  const slow = benchmark(slowFn, args, repetitions);
  const optimised = benchmark(optimisedFn, args, repetitions);
  console.log('Исходный вариант, замеры в мс на вызов: ' + slow.times.map(value => value.toFixed(3)).join(', '));
  console.log('Новый вариант, замеры в мс на вызов:     ' + optimised.times.map(value => value.toFixed(3)).join(', '));
  console.log('Медиана: исходный ' + slow.median.toFixed(3) + ' мс; новый ' + optimised.median.toFixed(3) + ' мс');

  if (optimised.median > 0) {
    const ratio = slow.median / optimised.median;
    console.log('Отношение времени исходного варианта к новому: ' + ratio.toFixed(2) + 'x');
  } else {
    console.log('Новый вариант слишком быстр для точного сравнения с текущей серией измерений.');
  }
}

console.log('JS-OPT: оптимизация обработки данных');
console.log('Для каждого задания сравниваются пять серий измерений; быстрые функции запускаются повторно в каждой серии.');

compareTask(
  '1. Поиск товара по ID',
  findProductByIdSlow,
  findProductByIdOptimised,
  [products, 2500],
  80,
  [[products, 1], [products, PRODUCT_COUNT], [products, PRODUCT_COUNT + 100]]
);

compareTask(
  '2. Фильтрация товаров по списку ID',
  filterSelectedProductsSlow,
  filterSelectedProductsOptimised,
  [products, selectedIds],
  2
);

compareTask(
  '3. Удаление повторяющихся кодов',
  uniqueCodesSlow,
  uniqueCodesOptimised,
  [codes],
  1
);

compareTask(
  '4. Многократный поиск товаров по ID',
  lookupProductsSlow,
  lookupProductsOptimised,
  [products, idsToLookup],
  1,
  [[products, [1, 1, PRODUCT_COUNT + 5, 500, 500]]]
);

compareTask(
  '5. Статистика заказов по статусам',
  countByStatusSlow,
  countByStatusOptimised,
  [orders],
  3
);

compareTask(
  '6. Поиск самого дорогого товара (дополнительно)',
  mostExpensiveProductSlow,
  mostExpensiveProductOptimised,
  [products],
  2
);

compareTask(
  '7. Сводка по категориям (дополнительно)',
  categorySummarySlow,
  categorySummaryOptimised,
  [products],
  2
);

console.log('\nВсе проверки завершены. Запишите медианы и объясните результат каждого выполненного задания');
