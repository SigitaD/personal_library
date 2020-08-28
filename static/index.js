// Inserts current date in the appropiate format for the "reading now" date input but just once
$("#btnTwo").one("click", function () {
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;       
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
$('#5stars').click(function(){
    $('#ratings').val('5');
});

$('#4stars').click(function(){
    $('#ratings').val('4');
});

$('#3stars').click(function(){
    $('#ratings').val('3');
});

$('#2stars').click(function(){
    $('#ratings').val('2');
});

$('#1stars').click(function(){
    $('#ratings').val('1');
});

// ISBN validation
$(document).ready(function(){    
    function validate(e) {
    	
      var Reg = /^$|^(?:\d[\ |-]?){13}$/;
      var isbn = document.getElementById('isbn');

      if (Reg.test(isbn.value) == false) {
        var invalid_isbn = document.createTextNode("Invalid ISBN");
        var error_message = document.getElementById("error_message");
        if (!error_message.firstChild) {
            error_message.appendChild(invalid_isbn);
        }
        isbn.focus();
        e.preventDefault(); // prevent the form sending
      } else {
        var error_message = document.getElementById("error_message");
        if (error_message.firstChild) {
            error_message.removeChild(error_message.firstChild)
        }
      }
    }
    
    //add event listener for form submission
    document.getElementById('form').addEventListener('submit', validate);
 });

 

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
$('#option_btn').click(function () {
    document.getElementById("show_menu").classList.toggle("show");
});
  
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
if (!event.target.matches('.dropdown')) {
    var dropdowns = document.getElementsByClassName("dropdown");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
    }
    }
}
}