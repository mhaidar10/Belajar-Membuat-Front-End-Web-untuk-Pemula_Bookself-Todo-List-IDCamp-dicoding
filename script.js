
const books = [];
const RENDER_EVENT = "render-books";


function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function findBook(bookId) {
    for (bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {

    for (index = 0; index < books.length; index += 1) {
        if (books[index].id === bookId) {
            return index
        }
    }

    return -1;
}

function addTaskToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget === null) return;

    bookTarget.isComplete = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTask(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}



function makeBook(bookObject) {
    const { id, title, author, year, isComplete } = bookObject;

    const textTitle = document.createElement("h3");
    textTitle.innerText = title;

    const authorTitle = document.createElement("p");
    authorTitle.innerText = `Penulis : ${author}`;


    const yearTitle = document.createElement("p");
    yearTitle.innerText = `Tahun : ${year}`;

    const action = document.createElement("div");
    action.classList.add("action");

    const article = document.createElement("article");
    article.classList.add("book_item");

    article.append(textTitle, authorTitle, yearTitle);
    article.setAttribute("id", `${id}`);


    if (isComplete == true) {

        const undoButton = document.createElement("button");
        undoButton.classList.add("undoBtn");
        undoButton.innerText = "Belum dibaca";

        undoButton.addEventListener("click", function () {
            undoTaskFromCompleted(id);

        });

        const removeButton = document.createElement("button");
        removeButton.classList.add("deleteBtn");
        removeButton.innerText = "Hapus buku";

        removeButton.addEventListener("click", function () {
            const peringatan = confirm("Yakin ingin hapus?");
            if (peringatan) {
                console.log("hapus")
                removeTask(id);

            } else {
                console.log("Batal")
            }
        });

        action.append(undoButton, removeButton);
        article.append(action);

    } else {

        const checkButton = document.createElement("button");
        checkButton.classList.add("doneBtn");
        checkButton.innerText = "Sudah dibaca";

        checkButton.addEventListener("click", function () {
            addTaskToCompleted(id);
        });

        const removeButton = document.createElement("button");
        removeButton.classList.add("deleteBtn");
        removeButton.innerText = "Hapus buku";

        removeButton.addEventListener("click", function () {
            const peringatan = confirm("Yakin ingin hapus?");
            if (peringatan) {
                console.log("hapus")
                removeTask(id);

            } else {
                console.log("Batal")
            }
        });

        action.append(checkButton, removeButton);
        article.append(action);

    }

    return article;
}

function addBook() {
    const textBook = document.getElementById("judul-buku").value;
    const textAuthor = document.getElementById("penulis-buku").value;
    const textYear = document.getElementById("tahun-buku").value;
    const checklist = document.getElementById("inputBookIsComplete").checked;
    const generatedID = generateId();
    console.log(checklist)
    if (checklist) {
        const bookObject = generateBookObject(generatedID, textBook, textAuthor, textYear, true);
        books.push(bookObject);
    } else {
        const bookObject = generateBookObject(generatedID, textBook, textAuthor, textYear, false);
        books.push(bookObject);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}



document.addEventListener("DOMContentLoaded", function () {
    const BtnClick = document.querySelector("#clickMe")
    
    const popup = document.querySelector('.popup')

    BtnClick.addEventListener("click", function () {
        popup.style.display = "flex"
        popup.style.position = "fixed"
    })

    const closeDoc = document.querySelector('.close')

    closeDoc.addEventListener('click', function () {
        popup.style.display = "none"
    })

    const submitForm = document.getElementById("masukan-buku");

    submitForm.addEventListener("submit", function (ev) {
        ev.preventDefault();
        addBook();
    });
    if (isStorageExist) {
        loadDataFromStorage();
    }

});

document.addEventListener(RENDER_EVENT, function () {
    const completedBookList = document.getElementById("sudah-dibaca");
    const uncompletdBookList = document.getElementById("belum-dibaca");
    
    
    completedBookList.innerHTML = "";
    uncompletdBookList.innerHTML = "";

    for (bookItem of books) {

        const bookElement = makeBook(bookItem);
        
        if (bookItem.isComplete) {
            completedBookList.append(bookElement);
        } else {
            uncompletdBookList.append(bookElement);
        }
    }
});

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);

        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

const SAVED_BOOKS = 'saved-books';
const STORAGE_KEY = 'BOOK_STORAGE';

function isStorageExist() {
    if (typeof (Storage) === "undefined") {
        alert("Browser tidak mendukung local storage");
        return false;
    }
    return true;
}

document.addEventListener(SAVED_BOOKS, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);

    if (data != null) {
        for (book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));

}


const searchBook = document.getElementById("book-cari");
searchBook.addEventListener("click", function (event) {
    event.preventDefault();

    const inputTitle = document.getElementById("cari-judul-buku").value.toLowerCase();
    const titleSearched = document.querySelectorAll('article');

    for (book of titleSearched) {
        const title = book.firstElementChild.textContent.toLowerCase();

        if (title.indexOf(inputTitle) !== -1) {
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    }
})


