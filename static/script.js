$(document).ready(function() {
    // Initialize current mode
    var currentMode = localStorage.getItem('mode') || 'light';
    updateMode(currentMode);

    // Toggle dark mode or light mode button
    $('.dark-light').change(function() {
        if ($(this).is(':checked')) {
            updateMode('dark');
        } else {
            updateMode('light');
        }
    });

    function updateMode(mode) {
        // Update the mode in localStorage
        localStorage.setItem('mode', mode);
        
        // Update the body class to reflect the current mode
        $('body').removeClass('dark-mode light-mode').addClass(mode + '-mode');

        // Update other elements based on the current mode
        if (mode === 'dark') {
            // Apply dark mode styles
            // Example: $('.navbar').css('background-color', '#333');
            $('.home-section').css('color', '#ffffff')
            $('.toggle_btn').css('color', '#ffffff')
            $('.manuscripts').css('background-color', '#272727')
            $('.blank').css('background-color', '#333')
            $('.title-manu').css('color', '#ffffff')
            $('.fe').css('color', '#ffffff')
            $('.columnx h1, .columnx p').css('color', '#ffffff')
            $('.profile').css('background-color', '#272727')
            $('.profile').css('color', '#ffffff')
            $('.link').css('background-color', '#272727')
            $('.link').css('color', '#ffffff')
            $('.links-container').css('background-color', '#272727')
            $('.right .details').css('background-color', '#272727')
            $('.right .details .container .postw').css('background-color', '#272727')
            $('.right .details .container .postw textarea').css('background-color', '#272727')
            $('.right .details .container .postw').css('color', '#ffffff')

        } else {
            // Apply light mode styles
            // Example: $('.navbar').css('background-color', '#fff');
            $('.home-section').css('color', '#0E345A')
            $('.toggle_btn').css('color', '#0E345A')
            $('.manuscripts').css('background-color', '#0E345A')
            $('.blank').css('background-color', '#ffffff')
            $('.title-manu').css('color', '#0E345A')
            $('.fe').css('color', '0E345A')
            $('.columnx h1, .columnx p').css('color', '#0E345A')
            $('.profile').css('background-color', '#ffffff')
            $('.profile').css('color', '#0E345A')
            $('.link').css('background-color', '#ffffff')
            $('.link').css('color', '#0E345A')
            $('.links-container').css('background-color', '#ffffff')
            $('.right .details').css('background-color', '#ffffff')
            $('.right .details .container .postw').css('background-color', '#ffffff')
            $('.right .details .container .postw textarea').css('background-color', '#ffffff')
            $('.right .details .container .postw').css('color', '#0E345A')

        }
    }
});


document.addEventListener('DOMContentLoaded', function() {
    var darkLightToggle = document.querySelector('.dark-light');

    darkLightToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
});


function toggleMenu() {
    var menu = document.getElementById("dropdownMenu");
    var barsIcon = document.getElementById("barsIcon");
    menu.classList.toggle("show");
    barsIcon.classList.toggle("fa-bars");
    barsIcon.classList.toggle("fa-times");
}

// Function to close dropdown menu if window is resized to a larger size
function closeMenuOnResize() {
    var menu = document.getElementById("dropdownMenu");
    if (window.innerWidth > 500 && menu.classList.contains("show")) {
        menu.classList.remove("show");
        var barsIcon = document.getElementById("barsIcon");
        barsIcon.classList.remove("fa-times");
        barsIcon.classList.add("fa-bars");
    }
}

// Add event listener for window resize event
window.addEventListener('resize', closeMenuOnResize);

// Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function previewImage(event) {
    var reader = new FileReader();
    reader.onload = function(){
        var output = document.getElementById('profile-pic');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

function removePicture() {
    // Add your code for removing the picture here
    document.getElementById('profile-pic').src = 'https://via.placeholder.com/150';
}


// Simulated user posts data (replace this with actual data from your database)
var userPosts = [
    { id: 1, content: "This is my first post!", timestamp: "2024-04-05 09:00:00" },
    { id: 2, content: "Feeling excited to share my thoughts.", timestamp: "2024-04-06 11:30:00" },
    { id: 3, content: "Just chilling and enjoying the day.", timestamp: "2024-04-07 13:45:00" }
];

// Function to populate timeline with user posts
function populateTimeline(posts) {
    var timeline = document.querySelector('.timeline');
    timeline.innerHTML = ''; // Clear existing content

    posts.forEach(function(post) {
        var postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <p>${post.content}</p>
            <div class="timestamp">${post.timestamp}</div>
        `;
        timeline.appendChild(postElement);
    });
}

// Populate timeline with user posts
populateTimeline(userPosts);

function uploadProfilePic(event) {
    // Upload profile picture logic (same as before)
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload-profile-pic', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Update the profile picture displayed on the page
        document.getElementById('profile-pic').src = data.filePath;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteProfilePic() {
    fetch('/delete-profile-pic', {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Reset the profile picture to default
            document.getElementById('profile-pic').src = 'default-profile-pic.jpg';
        } else {
            console.error('Error deleting profile picture');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_username',
    password: 'your_mysql_password',
    database: 'profiles'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('file');

// Route for uploading profile picture
app.post('/upload-profile-pic', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json({ error: 'Error uploading file' });
        } else {
            const filePath = req.file.path;

            // Save file path to MySQL database
            const sql = 'INSERT INTO profile_pics (file_path) VALUES (?)';
            connection.query(sql, [filePath], (err, result) => {
                if (err) {
                    res.status(500).json({ error: 'Error saving to database' });
                } else {
                    res.json({ filePath: filePath });
                }
            });
        }
    });
});

// Route for deleting profile picture
app.delete('/delete-profile-pic', (req, res) => {
    // Retrieve file path from MySQL database
    const sql = 'SELECT * FROM profile_pics';
    connection.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving file path from database' });
        } else if (rows.length === 0) {
            res.status(404).json({ error: 'Profile picture not found' });
        } else {
            const filePath = rows[0].file_path;

            // Delete file from server
            fs.unlink(filePath, (err) => {
                if (err) {
                    res.status(500).json({ error: 'Error deleting file from server' });
                } else {
                    // Delete file path from MySQL database
                    const deleteSql = 'DELETE FROM profile_pics WHERE id = ?';
                    connection.query(deleteSql, [rows[0].id], (err, result) => {
                        if (err) {
                            res.status(500).json({ error: 'Error deleting file path from database' });
                        } else {
                            res.sendStatus(200);
                        }
                    });
                }
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    fetchPapers();
    document.getElementById("upload-form").addEventListener("submit", uploadPaper);
});

function fetchPapers() {
    fetch("/papers")
        .then(response => response.json())
        .then(data => {
            displayPapers(data);
        })
        .catch(error => {
            console.error("Error fetching papers:", error);
        });
}

function displayPapers(papers) {
    const paperList = document.getElementById("paper-list");

    // Clear existing content
    paperList.innerHTML = "";

    // Populate the list with paper details
    papers.forEach(paper => {
        const li = document.createElement("li");
        li.classList.add("paper-item"); // Add CSS class to the list item
        li.innerHTML = `
            <div class="paper-title">${paper.title}</div>
            <div class="paper-info">
                <div><strong>Author:</strong> ${paper.author}</div>
                <div><strong>Publication Date:</strong> ${paper.publication_date}</div>
                <div><strong>Department:</strong> ${paper.department}</div>
            </div>
            <button class="preview-button" data-paper-id="${paper.id}">Preview</button>
        `;
        paperList.appendChild(li);
    });

    // Attach event listeners to preview buttons
    const previewButtons = document.querySelectorAll('.preview-button');
    previewButtons.forEach(button => {
        button.addEventListener('click', handlePreview);
    });
}

function handlePreview(event) {
    const paperId = event.target.dataset.paperId;
    // Perform actions to show a preview of the paper with the given ID
    // For example, you can open a modal window or redirect to a preview page
    console.log("Preview clicked for paper with ID:", paperId);
    // Implement your preview functionality here
}

function uploadPaper(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert("Paper uploaded successfully");
            fetchPapers();
        } else {
            alert("Failed to upload paper");
        }
    })
    .catch(error => {
        console.error("Error uploading paper:", error);
        alert("Failed to upload paper");
    });
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
