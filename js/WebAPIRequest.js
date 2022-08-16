/*
    Méthodes d'accès aux services Web API_Server/api
 */

    const apiBaseURL= "http://localhost:5000";

    function tokenRequestURL() {
        return apiBaseURL + 'api/accounts/token';
    }
    function storeAccessToken(token) {
        localStorage.setItem('access_Token', token);
    }
    function eraseAccessToken() {
        localStorage.removeItem('access_Token');
    }
    function retrieveAccessToken() {
        return  localStorage.getItem('access_Token');
    }
    function getBearerAuthorizationToken() {
        return { 'Authorization': 'Bearer ' + retrieveAccessToken() };
    }
    function registerRequestURL() {
        return apiBaseURL + '/api/accounts/register';
    }
    function storeLoggedUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
    function retrieveLoggedUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
    function deConnect() {
        localStorage.removeItem('user');
        eraseAccessToken();
    }
    function webAPI_Register(profil, successCallBack, errorCallBack){
        $.ajax({
            url: registerRequestURL(),
            type: 'POST',
            contentType:'application/json',
            data: JSON.stringify(profil),
            success: function () {
                successCallBack();
            },
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_register - error");
            }
        })
    }
    function webAPI_ChangeProfil( profil , successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/accounts/change",
            type: 'PUT',
            headers: getBearerAuthorizationToken(),
            contentType:'application/json',
            data: JSON.stringify(profil),
            success: () => {
                webAPI_getUserInfo(profil.Id, successCallBack, errorCallBack);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_POST - error");
            }
        });
    }
    function webAPI_login( Email, Password, successCallBack, errorCallBack) {        
        $.ajax({
            url: tokenRequestURL(),
            contentType:'application/json',
            type: 'POST',
            data: JSON.stringify({Email, Password}),
            success: function (profil) {
                storeAccessToken(profil.Access_token);
                webAPI_getUserInfo(profil.UserId, successCallBack, errorCallBack);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Erreur: " + profil)
                errorCallBack(jqXHR.status);
                console.log("webAPI_login - error");
            }
        })
    }
    function webAPI_getUserInfo(userId, successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/api/accounts/index" + "/" + userId,
            type: 'GET',
            contentType:'text/plain',
            data:{},
            success: function (profil) {
                console.log(profil);
                storeLoggedUser(profil);
                successCallBack();
            },
            error: function(jqXHR) {  
                errorCallBack(jqXHR.status);
                console.log("webAPI_login - error");
            }
        })
    }
    
    function webAPI_getUsersInfo(successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/accounts/index",
            type: 'GET',
            contentType:'text/plain',
            data:{},
            success: function (profil) {
                successCallBack(profil);
            },
            error: function(jqXHR) {  
                errorCallBack(jqXHR.status);
                console.log("webAPI_login - error");
            }
        })
    }
    function webAPI_getUserInfoForAvatar(userId, successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/accounts/index" + "/" + userId,
            type: 'GET',
            contentType:'text/plain',
            data:{},
            success: function (profil) {
                console.log(profil);
                successCallBack(profil);
            },
            error: function(jqXHR) {  
                errorCallBack(jqXHR.status);
                console.log("webAPI_login - error");
            }
        })
    }
    
    function webAPI_logout(userId, successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/accounts/logout/" + userId,
            contentType:'application/json',
            type: 'POST',
            data: JSON.stringify({Id: userId}),
            headers: getBearerAuthorizationToken(),
            success:() => {
                deConnect();
            },
            error: function(jqXHR) {
                deConnect();
                errorCallBack(jqXHR.status);
                console.log("webAPI_logout - error");
            }
        });
    }
    function webAPI_HEAD(successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/api/news",
            type: 'HEAD',
            contentType:'text/plain',
            complete: function(request) { 
                console.log(request.getResponseHeader('ETag'));
                successCallBack(request.getResponseHeader('ETag'));},
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_GET_ALL - error");
            }
        });
    }
    function webAPI_DELETE_Account( id, successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/accounts/remove/" + id,
            contentType:'text/plain',
            type: 'DELETE',
            headers: getBearerAuthorizationToken(),
            success:() => {localStorage.clear() ;successCallBack(); },
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_DELETE_Account - error");
            }
        });
    }
    
    //#region Categories
    function webAPI_GET_All_Categories(queryString, successCallBack, errorCallBack){
        $.ajax({
            url: apiBaseURL + "/api/categories" + queryString,
            type: 'GET',
            contentType:'text/plain',
            data:{},
            success: (data, status, xhr) => { 
                let ETag = xhr.getResponseHeader("ETag");
                successCallBack(data, ETag); 
                console.log("webAPI_GET_All_Categories - success", data); 
                console.log(`ETag: ${ETag}`);
            },
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_GET_All_Categories - error");
            }
        });
    }
    function webAPI_GET_Categories(id, successCallBack, errorCallBack){
        $.ajax({
            url: apiBaseURL + "/api/categories" + "/" + id,
            type: 'GET',
            contentType:'text/plain',
            data:{},
            success: (data, status, xhr) => { 
                let ETag = xhr.getResponseHeader("ETag");
                successCallBack(data, ETag); 
                console.log("webAPI_GET_Categories - success", data); 
                console.log(`ETag: ${ETag}`);
            },
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_GET_Categories - error");
            }
        });
    }
    function webAPI_POST_Categories( data , successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/api/categories",
            type: 'POST',
            headers: getBearerAuthorizationToken(),
            contentType:'application/json',
            data: JSON.stringify(data),
            success: () => {successCallBack();},
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_POST_Categories - error");
            }
        });
    }
    function webAPI_PUT_Categories(data, successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/api/categories" + "/" + data.Id,
            type: 'PUT',
            headers: getBearerAuthorizationToken(),
            contentType:'application/json',
            data: JSON.stringify(data),
            success:() => {successCallBack();},
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_PUT_Categories - error");
            }
        });
    }
    function webAPI_DELETE_Categories( id, successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/api/categories" + "/" + id,
            contentType:'text/plain',
            type: 'DELETE',
            headers: getBearerAuthorizationToken(),
            success:() => {successCallBack(); },
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_DELETE_Categories - error");
            }
        });
    //#endregion

    //#region Filters
        function webAPI_GET_All_Filters(queryString, successCallBack, errorCallBack){
        $.ajax({
            url: apiBaseURL + "/api/filters" + queryString,
            type: 'GET',
            contentType:'text/plain',
            data:{},
            success: (data, status, xhr) => { 
                let ETag = xhr.getResponseHeader("ETag");
                successCallBack(data, ETag); 
                console.log("webAPI_GET_All_Filters - success", data); 
                console.log(`ETag: ${ETag}`);
            },
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_GET_All_Filters - error");
            }
        });
    }
    function webAPI_GET_Filters(id, successCallBack, errorCallBack){
        $.ajax({
            url: apiBaseURL + "/api/filters" + "/" + id,
            type: 'GET',
            contentType:'text/plain',
            data:{},
            success: (data, status, xhr) => { 
                let ETag = xhr.getResponseHeader("ETag");
                successCallBack(data, ETag); 
                console.log("webAPI_GET_Filters - success", data); 
                console.log(`ETag: ${ETag}`);
            },
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_GET_Filters - error");
            }
        });
    }
    function webAPI_POST_Filters( data , successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/api/filters",
            type: 'POST',
            headers: getBearerAuthorizationToken(),
            contentType:'application/json',
            data: JSON.stringify(data),
            success: () => {successCallBack();},
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_POST_Filters - error");
            }
        });
    }
    function webAPI_PUT_Filters(data, successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/api/filters" + "/" + data.Id,
            type: 'PUT',
            headers: getBearerAuthorizationToken(),
            contentType:'application/json',
            data: JSON.stringify(data),
            success:() => {successCallBack();},
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_PUT_Filters - error");
            }
        });
    }
    function webAPI_DELETE_Filters( id, successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/api/filters" + "/" + id,
            contentType:'text/plain',
            type: 'DELETE',
            headers: getBearerAuthorizationToken(),
            success:() => {successCallBack(); },
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_DELETE_Filters - error");
            }
        });
    }
    //#endregion

    //#region Ingredients
    function webAPI_GET_All_Ingredients(queryString, successCallBack, errorCallBack){
        $.ajax({
            url: apiBaseURL + "/api/ingredients" + queryString,
            type: 'GET',
            contentType:'text/plain',
            data:{},
            success: (data, status, xhr) => { 
                let ETag = xhr.getResponseHeader("ETag");
                successCallBack(data, ETag); 
                console.log("webAPI_GET_All_Ingredients - success", data); 
                console.log(`ETag: ${ETag}`);
            },
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_GET_All_Ingredients - error");
            }
        });
    }
    function webAPI_GET_Ingredients(id, successCallBack, errorCallBack){
        $.ajax({
            url: apiBaseURL + "/api/ingredients" + "/" + id,
            type: 'GET',
            contentType:'text/plain',
            data:{},
            success: (data, status, xhr) => { 
                let ETag = xhr.getResponseHeader("ETag");
                successCallBack(data, ETag); 
                console.log("webAPI_GET_Ingredients - success", data); 
                console.log(`ETag: ${ETag}`);
            },
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_GET_Ingredients - error");
            }
        });
    }
    function webAPI_POST_Ingredients( data , successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/api/ingredients",
            type: 'POST',
            headers: getBearerAuthorizationToken(),
            contentType:'application/json',
            data: JSON.stringify(data),
            success: () => {successCallBack();},
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_POST_Ingredients - error");
            }
        });
    }
    function webAPI_PUT_Ingredients(data, successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/api/ingredients" + "/" + data.Id,
            type: 'PUT',
            headers: getBearerAuthorizationToken(),
            contentType:'application/json',
            data: JSON.stringify(data),
            success:() => {successCallBack();},
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_PUT_Ingredients - error");
            }
        });
    }
    function webAPI_DELETE_Ingredients( id, successCallBack, errorCallBack) {
        $.ajax({
            url: apiBaseURL + "/api/ingredients" + "/" + id,
            contentType:'text/plain',
            type: 'DELETE',
            headers: getBearerAuthorizationToken(),
            success:() => {successCallBack(); },
            error: function(jqXHR) {
                errorCallBack(jqXHR.status);
                console.log("webAPI_DELETE_Ingredients - error");
            }
        });
    }
    //#endregion

  //#region Recipes
  function webAPI_GET_All_Recipes(queryString, successCallBack, errorCallBack){
    $.ajax({
        url: apiBaseURL + "/api/recipes" + queryString,
        type: 'GET',
        contentType:'text/plain',
        data:{},
        success: (data, status, xhr) => { 
            let ETag = xhr.getResponseHeader("ETag");
            successCallBack(data, ETag); 
            console.log("webAPI_GET_All_Recipes - success", data); 
            console.log(`ETag: ${ETag}`);
        },
        error: function(jqXHR) {
            errorCallBack(jqXHR.status);
            console.log("webAPI_GET_All_Recipes - error");
        }
    });
}
function webAPI_GET_Recipes(id, successCallBack, errorCallBack){
    $.ajax({
        url: apiBaseURL + "/api/recipes" + "/" + id,
        type: 'GET',
        contentType:'text/plain',
        data:{},
        success: (data, status, xhr) => { 
            let ETag = xhr.getResponseHeader("ETag");
            successCallBack(data, ETag); 
            console.log("webAPI_GET_Recipes - success", data); 
            console.log(`ETag: ${ETag}`);
        },
        error: function(jqXHR) {
            errorCallBack(jqXHR.status);
            console.log("webAPI_GET_Recipes - error");
        }
    });
}
function webAPI_POST_Recipes(data , successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/api/recipes",
        type: 'POST',
        headers: getBearerAuthorizationToken(),
        contentType:'application/json',
        data: JSON.stringify(data),
        success: () => {successCallBack();},
        error: function(jqXHR) {
            errorCallBack(jqXHR.status);
            console.log("webAPI_POST_Recipes - error");
        }
    });
}
function webAPI_PUT_Recipes(data, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/api/recipes" + "/" + data.Id,
        type: 'PUT',
        headers: getBearerAuthorizationToken(),
        contentType:'application/json',
        data: JSON.stringify(data),
        success:() => {successCallBack();},
        error: function(jqXHR) {
            errorCallBack(jqXHR.status);
            console.log("webAPI_PUT_Recipes - error");
        }
    });
}
function webAPI_DELETE_Recipes(id, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/api/recipes" + "/" + id,
        contentType:'text/plain',
        type: 'DELETE',
        headers: getBearerAuthorizationToken(),
        success:() => {successCallBack(); },
        error: function(jqXHR) {
            errorCallBack(jqXHR.status);
            console.log("webAPI_DELETE_Recipes - error");
        }
    });
}
//#endregion

}