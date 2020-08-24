import os

from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import apology, login_required

app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQL("sqlite:///books.db")


@app.route("/")
@login_required
def index():
    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = :username",
                          username=request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")

@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")
        hashed = generate_password_hash(request.form.get("password"))
        confirmation = request.form.get("confirmation")

        # Ensure username was submitted
        if not username:
            return apology("must provide username", 403)

        # USERNAME CHECK
        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = :username",
                          username=request.form.get("username"))

        # Ensure username does not exist
        if len(rows) != 0:
            return apology("this username is taken", 403)

        # Ensure password was submitted
        elif not password:
            return apology("must provide password", 403)

        elif not confirmation:
            return apology("must confirm password", 403)

        # Ensure confirmation password matches password
        elif not password == confirmation:
            return apology("passwords do not match", 403)

        db.execute("INSERT INTO users (username, hash) VALUES (:username, :hash)", username = username, hash = hashed)

        # Log user in
        session["user_id"] = id
        session["username"] = username

        return redirect("/")

    else:
        return render_template("register.html")
    
@app.route("/quotes", methods=["GET", "POST"])
def quotes():
    # presents quotes if there are any

    if request.method == "GET":
        # query database for data about quotes
        quotes = db.execute("""SELECT * FROM quotes
                            JOIN books ON books.book_id = quotes.book_id
                            WHERE quotes.user_id = :user_id""",
                            user_id = session["user_id"])

        # query database for data about books
        books = db.execute("SELECT * FROM books WHERE user_id = :id",
            id = session["user_id"])

        # if there arent any books in database
        if books == 0:
            return apology("You need to add a book first!")
        
        #for quote in quotes:
            #author = quote["author"]
            #book = quote["title"]
            #text = quote["quote"]
            

        #for book in books:
            #author_name = book["author"]
            #title = book["title"]

        return render_template("quotes.html", quotes = quotes, books = books)

    else:
        quote = request.form.get("quote")
        author = request.form.get("author")
        book = request.form.get("book_title")

        if not quote:
            return apology("type your quote!", 404)
        
        if not author:
            return apology("select an author", 404)

        if not book:
            return apology("select the book ", 404)

        book_id = db.execute("""SELECT FROM books WHERE title = :title AND user_id = :user_id""",
            title = book,
            user_id = session["user_id"])
        
        # inserting new data into database
        db.execute("INSERT INTO quotes (user_id, book_id, quote) VALUES (:user_id, :book_id, :quote)",
            user_id = session["user_id"],
            book_id = book_id,
            quote = quote)

        return redirect("/")