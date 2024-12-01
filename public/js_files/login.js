const regForm = document.getElementById('auth-form');
const regEmailField = document.getElementById('email-field');
const regPasswordField = document.getElementById('password');
const regPasswordConfirmField = document.getElementById('password-confirm');
const regSubmitBtn = document.getElementById('submit-btn');


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
        if (!e.target.classList.contains('back-to-home')) {
            e.preventDefault();
            if (!sessionStorage.getItem('userID')) {
                currentGame = e.target;
                document.getElementById('sign-in-register-container').classList.remove('hidden');
            } else {
                switch(e.target.closest('.game').querySelector('h4').textContent){
                    case 'A11Y Bug-hunter': onBugHunterGame(); break;
                    case '2D WCAG Quest': OnAccessQuestGame(); break;
                    case 'A11Y Wordle': OnAccessibilityWordleGame(); break;
                    default: console.log("hey"); break;
                }
            }
        }
    });
});

regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(isSignIn == false){
        const password = regPasswordField.value;
        const passwordConfirm = regPasswordConfirmField.value;
        const email = regEmailField.value;

        if (password !== passwordConfirm) {
            alert("The entered passwords aren't the same.");
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

            if (response.ok) {
                sessionStorage.setItem('userID', data.user['uid']);
                console.log("User signed up:", data.user);
                document.getElementById('sign-in-register-container').classList.add('hidden');
                document.getElementById('additional-register-container').classList.remove('hidden');
                alert("User signed up sccessfully!");
            } else {
                console.error("Error signing up:", data);
                alert(data.error);
            }
        } catch (error) {
            console.error('Error signing up:', error);
            alert('Error signing up, please try again later.');
        }
    } else {
        const password = regPasswordField.value;
        const email = regEmailField.value;

        try {
            const response = await fetch('/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem('userID', data.user['uid']);
                console.log("User signed in:", data.user);
                alert("User signed in sccessfully!");
                document.getElementById('sign-in-register-container').classList.add('hidden');
            } else {
                console.error("Error signing in:", data.message);
                alert(data.error);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error, please try again later.");
        }
    }
});


document.getElementById("login-info").addEventListener("submit", function(event) {
    event.preventDefault();
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
            document.getElementById('additional-register-container').classList.add('hidden');
        } else {
            console.error("Failed to add document data");
        }
    })
    .catch(error => {
        console.error("Error adding data:", error);
    });
});

