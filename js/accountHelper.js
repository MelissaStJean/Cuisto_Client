function Login(){
    webAPI_login($("#loginEmail").val(),$("#loginPsw").val(),updateUI(),failLogin());
}

function initLogin(){
    $("#dialog-loginForm").dialog(
        {
            autoOpen: false,
            show: { effect: 'fade', speed: 400 },
            hide: { effect: 'fade', speed: 400 },
            minheight: "auto",
            minwidth: "auto",
            buttons: [
                {
                    id: 'btn-OkLogin',
                    text: 'Connecte-moi',
                    click: function () {
                        webAPI_login($("#loginEmail").val(),
                            $("#loginPsw").val(),
                            () => {
                                $("#dialog-loginForm").dialog("close");
                                updateUI();
                            },
                            failLogin);
                    }
                }
            ]
        });
        
    $('#dialog-loginForm').on('dialogopen', function (event) {
        if (localStorage.getItem('rememberme') == "1") {
            $("#remember-me").attr("checked", "checked");
            let email = localStorage.getItem('loginEmail');
            let password = localStorage.getItem('loginPsw');
            if (email) $("#loginEmail").val(email);
            if (password) $("#loginPsw").val(password);
        } else {
            $("#loginEmail").val("");
            $("#loginPsw").val("");
        }
    });
    
    $('#dialog-loginForm').on('dialogclose', function (event) {
        if ($('#remember-me').is(":checked")) {
            localStorage.setItem('rememberme', "1");
            localStorage.setItem('loginEmail', $("#loginEmail").val());
            localStorage.setItem('loginPsw', $("#loginPsw").val());
        } else {
            localStorage.setItem('rememberme', "0");
            localStorage.removeItem('loginEmail');
            localStorage.removeItem('loginPsw');
        }
    });
}

function FindUsers(){
    webAPI_getUsersInfo(getUsers,AlertError);
}

function getUsers(users){
    users.sort(function(a, b){
    if(a.Name < b.Name) { return -1; }
    if(a.Name > b.Name) { return 1; }
    return 0;
    })
}

function AlertError(status) {
    $.confirm({
        title: "Message provenant du server..." + status,
        content: '<img src="images/error.png" style="width:60px;margin:10px" alt="httpError"/>' + statusToString(status),
        buttons: {
            fermer: function () {
                this.close();
                if (status == 401) {
                    forceLogout();
                }
            }
        }
    });
}

function updateConnected() {
    connected = false;
    let username = "";
    if (retrieveLoggedUser() != null) {
        username = retrieveLoggedUser().Name;
        connected = true;
    }
    if (connected) {
        setUsername(username);
        //$("#avatarContainer").empty();
        //$("#avatarContainer").append(html_fittedAvatar(retrieveLoggedUser().AvatarURL, 'avatar'));
        $("#btn_Logout").show();
        $("#btn_OpenLoginForm").hide();
        $("#btn_OpenRegisterForm").hide()
        //$("#btn_Frigo").show();
        //$("#btn_Aide").show();
        $('#btn_OpenProfilDialog').attr("tooltip", "Profil");
    }
    else {
        //$("#avatarContainer").empty();
        //$("#btn_OpenConfirmLogout").hide();
        unsetUsername();
        $("#btn_Logout").hide();
        $("#btn_OpenLoginForm").show();
        $("#btn_OpenRegisterForm").show()
        //$("#btn_Frigo").hide();
        //$("#btn_Aide").hide();
        $('#btn_OpenProfilDialog').attr("tooltip", "Création de compte");
    }
}

function statusToString(status) {
    let text = "Le server ne répond pas.";
    switch (status) {
        case 401: text = "<br>Requête non autorisée. <br>Vous devez être connecté."; break;
        case 409: text = "<br>Conflit de données. <br>Requête refusée."; break;
        case 422: text = "<br>Format des données soumises incorrect. <br>Requête refusée."; break;
    }
    return text;
}

function getCategoriesCircle(){
    webAPI_GET_All_Categories("",circlesGenerator,AlertError);
}

function circlesGenerator(categories){
    categories.forEach(category => {
        let divCircle = document.createElement("div");
        divCircle.className = "circle";
        divCircle.id = "category_" + category.Id;

        let divCircleTxt = document.createElement("div");
        divCircleTxt.className = "circle_text";
        divCircleTxt.textContent = category.CategoryName;

        divCircle.append(divCircleTxt);
        $("#circleGenerator").append(divCircle);
    });
}

function initRegister(){
    $("#dialog-registerForm").dialog(
    {
        autoOpen: false,
        show: { effect: 'fade', speed: 400 },
        hide: { effect: 'fade', speed: 400 },
        minheight: "auto",
        minwidth: "auto",
        buttons: [
            {
                id: 'btn-OkRegister',
                text: 'Inscris-moi',
                click: function () {
                    let profilFromForm = {
                        Id: parseInt($("#createProfilId").val()),
                        Name: $("#createUsername").val(),
                        Email: $("#createEmail").val(),
                        Password: $("#createPassword").val(),
                        AvatarGUID: $("#avatarGUID").val()
                    }
                    profilFromForm.Id = 0;
                    webAPI_Register(profilFromForm,() => { $("#dialog-registerForm").dialog("close"); $("#dialog-loginForm").dialog("open"); $("#confirmCreation").show();}, updateUI,AlertError);
                    
                }
            }
        ]
    });
}

function OpenConfirmLogout() {
    $.confirm({
        title: 'Déconnection...',
        content: 'Voulez-vous vous déconnecter?',
        buttons: {
            confirmer: function () {
                pauseNewsListPeriodicRefresh = false;
                webAPI_logout(retrieveLoggedUser().Id, updateUI(true), AlertError);
            },
            annuler: {},
        }
    });
}

function failLogin() {
    console.log("Login failed")
    Alert("Connexion échouée");
    connected = false;
    unsetUsername();
    updateUI(true);
}

function Alert(message) {
    $.confirm({
        title: message,
        content: '',
        buttons: {
            fermer: function () { }
        }
    });
}

function OpenLoginForm() {
    $('#btn-CancelLogin').addClass("btn btn-dark");
    $("#dialog-loginForm").dialog('open');
    $('#btn-OkLogin').addClass("btn btn-secondary");
} 

function OpenRegisterForm() {
    $('#btn-CancelRegister').addClass("btn btn-secondary");
    $("#dialog-registerForm").dialog('open');
    $('#btn-OkRegister').addClass("btn btn-secondary");
}

function setUsername(username) {
    $("#username").html("<span style='color:black;'>" + username + "</span>");
}

function unsetUsername() {
    $("#username").html("<span style='color:black'>non connecté</span>");
}

function updateUI(forceRefresh = false) {
    console.log("Update d'UI")
    if(forceRefresh){
        location.reload(true);
    }
    updateConnected();
}

function importData() {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
        let files =   Array.from(input.files);
        console.log(files);
        //document.getElementById("#avatarImage").src="newSource.png";
    };
    input.click();
}

function openRightMenu() {
    document.getElementById("rightMenu").style.display = "block";
}

function closeRightMenu() {
    document.getElementById("rightMenu").style.display = "none";
}

function changePage(name){
    document.location.href = name + ".html";
}