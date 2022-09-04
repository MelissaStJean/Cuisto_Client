function addIngredient(){
    let ingredient = {
        IngredientName: $("#ingredientName").val(),
        IngredientQuantity: parseFloat($("#quantityIngredient").val()),
        IngredientMeasure: $("#ingredientMeasure").val(),
        IngredientCategory: $("#ingredientCategory").val(),
        IngredientExpirationDate: $("#ingredientExpirationDate").val(),
        IngredientImageGUID: $("#ingredientImageGUID").val(),
        UserId: retrieveLoggedUser().Id
    };
    ingredient.Id = 0;
    webAPI_POST_Ingredients(ingredient,updateUI(true),AlertError);
}  

function getIngredients(){
    webAPI_GET_All_Ingredients("",updateIngredientList,AlertError);
}

function updateIngredientList(ingredients) {
    console.log(ingredients);
    $('#fruits_Container').empty();
    $('#meats_Container').empty();
    $('#milks_Container').empty();
    $('#others_Container').empty();
    let loggedUserId = (retrieveLoggedUser() ? retrieveLoggedUser().Id : null);
    //if (loggedUserId) {
        ingredients.forEach(ingredient => {
            if(ingredient.UserId == loggedUserId){
                switch(ingredient.IngredientCategory){
                    case "Fruits et légumes":
                        $('#fruits_Container').append(fridgeItems(ingredient));
                        break;
                    case "Viandes et poissons":
                        $('#meats_Container').append(fridgeItems(ingredient));
                        break;
                    case "Produits laitiers":
                        $('#milks_Container').append(fridgeItems(ingredient));
                        break;
                    case "Produits dérivés":
                        $('#others_Container').append(fridgeItems(ingredient));
                        break;
                }
            }
        });
    //}
}

function fridgeItems(ingredient) {
    let trElement = document.createElement("tr");
    let tdElement = document.createElement("td");
    tdElement.setAttribute("style","border-bottom: 1px solid grey;");
    trElement.setAttribute("style","display:table");

    let divIngredient = document.createElement("div");
    divIngredient.setAttribute("style","display:flex; justify-content: space-between");
    divIngredient.id = "ingredientId_" + ingredient.Id; 
    let ingredientName = document.createElement("p");
    ingredientName.setAttribute("style","width:175px;font-size:large; font-family:Marker Felt, fantasy")
    ingredientName.textContent = ingredient.IngredientName;
    let quantityName = document.createElement("p");
    quantityName.setAttribute("style","font-size:18px; font-family:Marker Felt, fantasy;margin:0px");
    quantityName.textContent = ingredient.IngredientQuantity + " " + ingredient.IngredientMeasure;

    let removeIcon = document.createElement("button");
    removeIcon.className = "gicon glyphicon glyphicon-minus";
    removeIcon.id = "glyph";
    removeIcon.setAttribute("style","scale: 0.5;")
    removeIcon.addEventListener( 'click' , function() {
        removeQty(ingredient);
    })
    
    let addIcon = document.createElement("button");
    addIcon.className = "gicon glyphicon glyphicon-plus";
    addIcon.id = "glyph";
    addIcon.setAttribute("style","scale: 0.5;")
    addIcon.addEventListener( 'click' , function() {
        addQty(ingredient);
    })

    let trashIcon = document.createElement("button");
    trashIcon.className = "gicon glyphicon glyphicon-trash";
    trashIcon.id = "glyph";
    trashIcon.setAttribute("style","scale: 0.5;")
    trashIcon.addEventListener( 'click' , function() {
        webAPI_DELETE_Ingredients(ingredient.Id,updateUI(true),AlertError);
    })

    let expirationDate = document.createElement("p");
    expirationDate.textContent =ingredient.IngredientExpirationDate;
    divIngredient.append(ingredientName);
    divIngredient.append(removeIcon);
    divIngredient.append(quantityName);
    divIngredient.append(addIcon);
    divIngredient.append(trashIcon);
    tdElement.append(divIngredient);
    tdElement.append(expirationDate);
    trElement.append(tdElement);
    return trElement;
}



function addQty(ingredient){
    ingredient.IngredientQuantity += 1;
    webAPI_PUT_Ingredients(ingredient,updateUI(true),AlertError);

}
function removeQty(ingredient){
    ingredient.IngredientQuantity -= 1;
    if(ingredient.IngredientQuantity == 0){
        webAPI_DELETE_Ingredients(ingredient.Id,updateUI(true),AlertError);
        return;
    }
    webAPI_PUT_Ingredients(ingredient,updateUI(true),AlertError);
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
                pauseNewsListPeriodicRefresh = true;
            }
        }
    });
}
function statusToString(status) {
    let text = "Le serveur ne répond pas.";
    switch (status) {
        case 401: text = "<br>Requête non autorisée. <br>Vous devez être connecté."; break;
        case 409: text = "<br>Conflit de données. <br>Requête refusée."; break;
        case 422: text = "<br>Format des données soumises incorrect. <br>Requête refusée."; break;
    }
    return text;
}