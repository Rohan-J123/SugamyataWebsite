var accessibilityWordleGameURL = 'http://127.0.0.1:5500';
var accessQuestGameURL = 'http://127.0.0.1:5501';
var bughunterGameURL = 'http://127.0.0.1:5500';


function OnAccessibilityWordleGame(){
    console.log("Accessibility Wordle");
    // window.location.href = accessibilityWordleGameURL + "?userId=" + sessionStorage.getItem('userID');
}

function OnAccessQuestGame(){
    console.log("Access Quest");
    // window.location.href = accessQuestGameURL + "?userId=" + sessionStorage.getItem('userID');
}

function onBugHunterGame(){
    console.log("Bug Hunter");
    // window.location.href = bughunterGameURL + "?userId=" + sessionStorage.getItem('userID');
}