function OpenAddRecipeForm() {
    $("#dialog-addRecipeForm").dialog('open');
}

function initRecipe(){
    $("#dialog-addRecipeForm").dialog(
    {
        autoOpen: false,
        show: { effect: 'fade', speed: 400 },
        hide: { effect: 'fade', speed: 400 },
        minheight: "auto",
        minwidth: "auto",
        buttons: [
            {
                id: 'btn-OkLogin',
                text: 'Crée une recette',
                click: function () {
                    let recipe = {
                        RecipeName : $("#nameRecipe").val(),
                        RecipeCategory : $("#recipeCategory").val(),
                        RecipeIngredient : $("#ingredients").val(),
                        RecipeSteps : $("#steps").val(),
                        RecipeDishesNumber : $("#portionNumber").val(),
                        RecipeDifficulty : parseFloat(getDifficultyValue()),
                        RecipeRating : parseInt(getRatingValue()),
                        RecipePreparationTime : parseFloat($("#preparationTime").val()),
                        RecipeCookingTime : parseFloat($("#cookingTime").val()),
                        RecipeCookingTemperature : parseFloat($("#temperature").val()),
                        RecipeHints : $("#advice").val(),
                        RecipeLastResort : $("#alternatives").val(),
                        //RecipeImageGUID : $("#RecipeSteps").val(),
                    };
                    recipe.Id = 0;
                    webAPI_POST_Recipes(
                        recipe,
                        () => {
                            $("#dialog-addRecipeForm").dialog("close");
                            updateUI();
                        },
                        updateUI());
                }
            }
        ]
    });
}

function getRecipes(){
    webAPI_GET_All_Recipes("",updateIngredientList,AlertError);
}

function getDifficultyValue () {
    var ele = document.getElementsByName('rating2');
     for(i = 0; i < ele.length; i++) { 
        if(ele[i].checked) {
        return ele[i].value;
     }
    } 
}

function getRatingValue () {
    var ele = document.getElementsByName('rating3');
     for(i = 0; i < ele.length; i++) { 
        if(ele[i].checked) {
        return ele[i].value;
     }
    } 
}