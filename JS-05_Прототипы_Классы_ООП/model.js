// Класс для автора книги
export class Author {
    constructor(name, country) {
        this.name = name;
        this.country = country;
    }

    getAuthorInfo() {
        return `${this.name} (${this.country})`;
    }
}

// Класс для самой книги
export class Book {
    constructor(title, author, pages) {
        this.title = title;
        this.author = author; // Сюда передается экземпляр класса Author (композиция)
        this.pages = pages;
        this.isRead = false; // Начальное состояние
    }

    // Метод переключения статуса прочтения
    toggleReadStatus() {
        this.isRead = !this.isRead;
    }
}
