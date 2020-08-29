// Inserts current date in the appropiate format for the "reading now" date input but just once
$("#btnTwo").one("click", function () {
    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    let today = year + "-" + month + "-" + day;
    $("#dateReadingNow").attr("value", today);
});


// Selecting bootstrap accordion card is reseting values of another accordion card - for the sake of writting values of just one card (if both of the cards have some input in)
function ClearFieldsOne() {
    document.getElementById("start_date").value = "";
    document.getElementById("finish_date").value = "";
};

function ClearFieldsTwo() {
    document.getElementById("dateReadingNow").value = "";
};

//Get the value of a star rating to be able to insert it into database
$('#5stars').click(function () {
    $('#ratings').val('5');
});

$('#4stars').click(function () {
    $('#ratings').val('4');
});

$('#3stars').click(function () {
    $('#ratings').val('3');
});

$('#2stars').click(function () {
    $('#ratings').val('2');
});

$('#1stars').click(function () {
    $('#ratings').val('1');
});


// ISBN validation
$(document).ready(function () {
    function validate(e) {

        let Reg = /^$|^(?:\d[\ |-]?){13}$/;
        let isbn = document.getElementById('isbn');

        if (Reg.test(isbn.value) == false) {
            var invalid_isbn = document.createTextNode("Invalid ISBN");
            var error_message = document.getElementById("error_message");
            if (!error_message.firstChild) {
                error_message.appendChild(invalid_isbn);
            }
            isbn.focus();
            e.preventDefault(); // prevent the form sending
        } else {
            let error_message = document.getElementById("error_message");
            if (error_message.firstChild) {
                error_message.removeChild(error_message.firstChild)
            }
        }
    }

    //add event listener for form submission
    document.getElementById('form').addEventListener('submit', validate);
});


// Redirects to book page when this function is called.
// Should not proceed with redirection if action originates from options menu.
function redirectToBook(bookId) {
    let shouldRedirect = true;
    event.composedPath().forEach(domElement => {
        if (domElement.classList && domElement.classList.contains('options'))
            shouldRedirect = false;
    })

    if (shouldRedirect)
        document.location.href = '/book/' + bookId;
}


// ---------------------- OPTIONS START --------------------------------


// Function to show options when triple dot is clicked.
// Hides when same dots are pressed.
// Hides first dropdown menu if second is pressed while first one is still showed.
let openedOptions = null;

function showOptionsFor(optionsId) {
    const clickedOptions = document.getElementById(optionsId);
    if (openedOptions) {
        openedOptions.classList.remove('show');
    }

    if (openedOptions !== clickedOptions) {
        openedOptions = clickedOptions;
        openedOptions.classList.toggle("show");
    } else {
        openedOptions = null;
    }
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.options_image')) {
        let options_content = document.getElementsByClassName("options_content");
        let i;
        for (i = 0; i < options_content.length; i++) {
            let openDropdown = options_content[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
        openedOptions = null;
    }
    if (!event.target.matches('.book_options_image')) {
        let options_content = document.getElementsByClassName("book_options_content");
        let i;
        for (i = 0; i < options_content.length; i++) {
            let openDropdown = options_content[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Update #readingNowModal contents before it is shown.
// 'show.bs.modal' is a default bootstrap event which triggers when modal is about to be shown.
$('#readingNowModal').on('show.bs.modal', updateModalWithBookId)

// Update #finishedReadingModal contents before it is shown.
// 'show.bs.modal' is a default bootstrap event which triggers when modal is about to be shown.
$('#finishedReadingModal').on('show.bs.modal', updateModalWithBookId)


// Update #deleteBookConfirmationModal contents before it is shown.
// 'show.bs.modal' is a default bootstrap event which triggers when modal is about to be shown.
$('#deleteBookConfirmationModal').on('show.bs.modal', updateModalWithBookId)

function updateModalWithBookId(event) {
    openedOptions = null;

    let actionOrigin = $(event.relatedTarget)
    let bookId = actionOrigin.data('bookid')

    let modal = $(this)
    modal.find('.modal-content #update_book_id').val(bookId)
}


// Sends DELETE request to delete book with bookId from the database.
// When response is retrieved - refreshes index page.
$('#confirmBookDeleteFromList').click(function () {
    let modal = $(this)  //Delete confirmation button
    let bookId = modal.find('+ #update_book_id').val(); //Find #update_book_id input which is next to delete confirmation button

    let book = {"bookId": bookId};
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/delete-book", true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = function () {
        location.reload();
    };
    xhr.send(JSON.stringify(book));
})

// Sends DELETE request to delete book with bookId from the database.
// When response is retrieved - refreshes index page.
$('#confirmBookDelete').click(function () {
    let modal = $(this)  //Delete confirmation button
    let bookId = modal.find('+ #update_book_id').val(); //Find #update_book_id input which is next to delete confirmation button

    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/book/" + bookId, true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = function () {
        location.href = "/";
    };
    xhr.send();
})


// Sends POST request to mark book with bookId as currently not being read by the user.
// When response is retrieved - refreshes index page.
function notReading(bookId) {
    let book = {"bookId": bookId};
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/not-reading-book", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        location.reload();
    };
    xhr.send(JSON.stringify(book));
}

// ---------------------- OPTIONS END --------------------------------