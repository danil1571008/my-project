import { Library } from './app.js';

const myLibrary = new Library();

// Элементы DOM
const form = document.getElementById('book-form');
const booksContainer = document.getElementById('books-container');

// Функция отрисовки списка книг
function renderBooks() {
    booksContainer.innerHTML = '';

    myLibrary.books.forEach((book, index) => {
        const bookElement = document.createElement('div');
        bookElement.className = `book-card ${book.isRead ? 'read' : ''}`;
        
        bookElement.innerHTML = `
            <h3>"${book.title}"</h3>
            <p>Автор: ${book.author.getAuthorInfo()}</p>
            <p>Страниц: ${book.pages}</p>
            <p>Статус: <strong>${book.isRead ? 'Прочитано' : 'Не читано'}</strong></p>
            <button class="toggle-btn" data-index="${index}">Изменить статус</button>
            <button class="delete-btn" data-index="${index}">Удалить</button>
            <hr>
        `;
        
        booksContainer.appendChild(bookElement);
    });
}

// Обработка отправки формы (Создание)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const authorName = document.getElementById('author').value;
    const country = document.getElementById('country').value;
    const pages = document.getElementById('pages').value;

    myLibrary.addBook(title, authorName, country, pages);
    renderBooks();
    form.reset();
});

// Обработка кликов по кнопкам (Удаление и Изменение статуса)
booksContainer.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    if (index === undefined) return;

    if (e.target.classList.contains('delete-btn')) {
        myLibrary.deleteBook(index);
    } else if (e.target.classList.contains('toggle-btn')) {
        myLibrary.books[index].toggleReadStatus();
    }
    
    renderBooks();
});

// Добавим одну книгу по умолчанию для демонстрации
myLibrary.addBook('Капитанская дочка', 'Александр Пушкин', 'Россия', 160);
renderBooks();
