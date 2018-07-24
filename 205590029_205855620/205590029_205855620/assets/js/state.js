//show the relevant tabs of the tool when login/logout
function state_login() { 
    document.getElementById("fav").style.display = "block";
    document.getElementById("myPage").style.display = "block";
    document.getElementById("reg").style.display = "none";
    document.getElementById("logout").style.display = "block";
    document.getElementById("home").style.display = "none";
}
function state_logout() {
    document.getElementById("reg").style.display = "block";
    document.getElementById("myPage").style.display = "none";
    document.getElementById("fav").style.display = "none";
    document.getElementById("logout").style.display = "none";
    document.getElementById("home").style.display = "block";   
}