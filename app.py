from flask import Flask, jsonify, render_template, request, redirect, url_for, flash, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from functools import wraps
import os
from werkzeug.utils import secure_filename
import mysql.connector

app = Flask(__name__)
app.config['SECRET_KEY'] = 'gensei213077'  # Change this to a strong, unique secret key
app.config['SESSION_PERMANENT'] = True
app.config['SESSION_TYPE'] = 'filesystem'  # You can also use other session types (e.g., 'redis')
app.config['UPLOAD_FOLDER'] = 'uploads/'

# MySQL configuration
app.config['MYSQL_HOST'] = 'localhost'  # Change this to your MySQL host
app.config['MYSQL_USER'] = 'root'  # Change this to your MySQL username
app.config['MYSQL_PASSWORD'] = 'gensei213077'  # Change this to your MySQL password
app.config['MYSQL_DB'] = 'URSMLIB'  # Change this to your MySQL database name
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:gensei213077@localhost/URSMLIB'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Define your MySQL connection
connection = mysql.connector.connect(
    host=app.config['MYSQL_HOST'],
    user=app.config['MYSQL_USER'],
    password=app.config['MYSQL_PASSWORD'],
    database=app.config['MYSQL_DB']
)
cursor = connection.cursor(dictionary=True)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Login required. Please log in.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


# Dummy data for demonstration purposes
posts = [
    {"title": "Post 1", "content": "Content of post 1", "author": "Author 1", "date": "2024-04-08"},
    {"title": "Post 2", "content": "Content of post 2", "author": "Author 2", "date": "2024-04-07"},
    # More posts...
]

@app.route('/')
def index():
    return render_template('index.html', posts=posts)

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        flash("Account created successfully! You can now log in.", "success")
        return redirect(url_for("login"))

    return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        student_number = request.form.get("student_number")
        password = request.form.get("password")

        user = User.query.filter_by(email=email).first()

        if user and bcrypt.check_password_hash(user.password, password):
            session.permanent = True
            session['user_id'] = user.id
            flash("Login successful!", "success")
            return redirect(url_for("home"))
        else:
            flash("Login unsuccessful. Please check your email and password.", "danger")

    return render_template("login.html")

@app.route("/logout")
@login_required
def logout():
    session.clear()
    flash("You have been logged out.", "success")
    return redirect(url_for("index"))

@app.route("/profile")
@login_required
def profile():
    user = User.query.get(session['user_id'])
    return render_template("profile.html", user=user)

@app.route('/upload', methods=['POST'])
def upload_paper():
    file = request.files['file']
    title = request.form['title']
    author = request.form['author']
    publication_date = request.form['publication_date']
    department = request.form['department']

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Save details to database
        cursor.execute("INSERT INTO research_papers (title, author, publication_date, department, file_path) VALUES (%s, %s, %s, %s, %s)",
                       (title, author, publication_date, department, file_path))
        connection.commit()

        return jsonify({'message': 'Research paper uploaded successfully'}), 201
    else:
        return jsonify({'error': 'Invalid file format'}), 400

@app.route('/papers', methods=['GET'])
def get_papers():
    cursor.execute("SELECT title, author, publication_date, department FROM research_papers")
    papers = cursor.fetchall()
    return jsonify(papers)

@app.route('/paper/<paper_id>')
def get_paper(paper_id):
    cursor.execute("SELECT file_path FROM research_papers WHERE id = %s", (paper_id,))
    paper = cursor.fetchone()
    if paper:
        return send_from_directory(app.config['UPLOAD_FOLDER'], os.path.basename(paper['file_path']))
    else:
        return jsonify({'error': 'Paper not found'}), 404

if __name__ == "__main__":
    app.run(debug=True)
