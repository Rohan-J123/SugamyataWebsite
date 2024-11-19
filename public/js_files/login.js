const authForm = document.getElementById('auth-form');
const authEmailField = document.getElementById('auth-email');
const authPasswordField = document.getElementById('auth-password');
const authSubmitBtn = document.getElementById('auth-submit-btn');

const regForm = document.getElementById('reg-form');
const regEmailField = document.getElementById('reg-email');
const regPasswordField = document.getElementById('reg-password');
const regPasswordConfirmField = document.getElementById('reg-password-confirm');
const regSubmitBtn = document.getElementById('reg-submit-btn');

const playButtons = document.querySelectorAll('.play-button');
const toggleLinks = document.querySelectorAll('.toggle-link');

let isSignIn = true;
let currentGame = null;

document.getElementById('login-field').addEventListener('change', function() {
    var selectedValue = '';
    switch (this.value) {
        case 'High School Student': selectedValue = 'subfield-highschool'; break;
        case 'Undergraduate Student': selectedValue = 'subfield-undergrad'; break;
        case 'Graduate Student': selectedValue = 'subfield-grad'; break;
        case 'Working Professional': selectedValue = 'subfield-worker'; break;
        case 'Other': selectedValue = 'subfield-other'; break;
    };
    var dropdowns = document.getElementById('sub-field-dropdowns').children;
    
    for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].style.display = 'none';    
    }

    document.getElementById(selectedValue).style.display = 'block';
    document.getElementById(selectedValue + '-label').style.display = 'block';
});

playButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        if (!sessionStorage.getItem('userID')) {
            currentGame = e.target;
            document.getElementById('sign-in-register-container').style.display = 'block';
        } else {
            switch(e.target.closest('.game').querySelector('h4').textContent){
                case 'A11Y Bug Hunter': onBugHunterGame(); break;
                default: console.log("hey"); break;
            }
        }
    });
});

function onToggleLink(){
    isSignIn = !isSignIn;
    if (isSignIn) {
        document.getElementById('sign-in-register-container').style.display = 'block';
        document.getElementById('sign-up-register-container').style.display = 'none';
    } else {
        document.getElementById('sign-in-register-container').style.display = 'none';
        document.getElementById('sign-up-register-container').style.display = 'block';
    }
}

regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('spinner-circle').style.display = 'block';
    
    const password = regPasswordField.value;
    const passwordConfirm = regPasswordConfirmField.value;
    const email = regEmailField.value;

    if (password !== passwordConfirm) {
        alert("The entered passwords aren't the same.");
        document.getElementById('spinner-circle').style.display = 'none';
        return;
    }

    try {
        const response = await fetch('/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        document.getElementById('spinner-circle').style.display = 'none';

        if (response.ok) {
            sessionStorage.setItem('userID', data.user['uid']);
            console.log("User signed up:", data.user);
            document.getElementById('sign-in-register-container').style.display = 'none';
            document.getElementById('sign-up-register-container').style.display = 'none';
            document.getElementById('login-open').click();
        } else {
            console.error("Error signing up:", data);
            alert(data.error);
        }
    } catch (error) {
        console.error('Error signing up:', error);
        alert('Error signing up, please try again later.');
    }
});


authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('spinner-circle').style.display = 'block';
    
    const password = authPasswordField.value;
    const email = authEmailField.value;

    try {
        const response = await fetch('/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        document.getElementById('spinner-circle').style.display = 'none';

        if (response.ok) {
            sessionStorage.setItem('userID', data.user['uid']);
            console.log("User signed in:", data.user);
            document.getElementById('sign-in-register-container').style.display = 'none';
            document.getElementById('sign-up-register-container').style.display = 'none';
        } else {
            console.error("Error signing in:", data.message);
            alert(data.error);
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error, please try again later.");
    }
});

document.getElementById("login-info").addEventListener("submit", function(event) {
    document.getElementById('spinner-circle').style.display = 'block';
    event.preventDefault();
    document.getElementById('spinner-circle').style.display = 'block';
    const name = document.getElementById("login-name").value;
    const field = document.getElementById("login-field").value;
    const accessibilityKnowledge = document.getElementById("login-accessibilty-knowledge").value;
    const area = document.getElementById("login-area").value;

    var subfield='';
    switch(document.getElementById("login-field").value){
        case 'High School Student': subfield = document.getElementById('subfield-highschool').value; break;
        case 'Undergraduate Student': subfield = document.getElementById('subfield-undergrad').value; break;
        case 'Graduate Student': subfield = document.getElementById('subfield-grad').value; break;
        case 'Working Professional': subfield = document.getElementById('subfield-worker').value; break;
        case 'Other': subfield = document.getElementById('subfield-other').value; break;
    }

    const userData = {
        id: sessionStorage.getItem('userID'),
        name: name,
        field: field,
        accessibilityKnowledge: accessibilityKnowledge,
        area: area,
        subfield: subfield
    };

    fetch('/addDocumentData?collectionName=player-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.id) {
            sessionStorage.setItem("user-name", name);
            document.getElementById('spinner-circle').style.display = 'none';
            document.getElementById('login-close').click();
        } else {
            console.error("Failed to add document data");
        }
    })
    .catch(error => {
        console.error("Error adding data:", error);
        document.getElementById('spinner-circle').style.display = 'none';
    });
});

