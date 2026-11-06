import { Book, Author } from './model.js';

export class Library {
    constructor() {
        this.books = [];
    }

    // Создание книги внутри библиотеки через new
    addBook(title, authorName, authorCountry, pages) {
        const author = new Author(authorName, authorCountry);
        const book = new Book(title, author, Number(pages));
        this.books.push(book);
        return book;
    }

    // Удаление книги по индексу
    deleteBook(index) {
        this.books.splice(index, 1);
    }
}
