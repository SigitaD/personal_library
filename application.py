from flask import Flask, render_template, flash, redirect
from datetime import datetime
import sqlite3
from sqlite3 import Error


app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"

def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(sqlite3.version)
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == '__main__':
    create_connection(r"C:\Users\Erika\Documents\final project\books.db")