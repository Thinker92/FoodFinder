const inputEl = document.getElementById("userInput");
const searchButton = document.getElementById("searchButton");
const recipeList = document.getElementById("recipeResults");
const myRecipesButton = document.getElementById("myRecipesButton");

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '25c699ff54msh434da319c653bbdp1fc1d3jsnf90a41af76ed',
        'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
    }
};

inputEl.addEventListener('keydown', function(e){
    if (e.key === 'Enter') {
        e.preventDefault();
        searchButton.click();
    }
});

searchButton.addEventListener('click', searchRecipes);

function searchRecipes() {
    const userInput = encodeURIComponent(inputEl.value.trim());
    const recipeListUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=${userInput}&instructionsRequired=true&number=25`;

    fetch(recipeListUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log(result);
            displayResults(result.results);
        })
        .catch(error => {
            console.error(error);
        });
}

function displayResults(results) {
    // Clearing Old search results
    recipeList.innerHTML = '';

    results.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.innerHTML = `
            <img class="recipeImage" src="${recipe.image}" alt="${recipe.title}" data-id="${recipe.id}">
            <div class="cardUnderSection">
            <h2>${recipe.title}</h2>
            <button class="saveButton" value="${recipe.id}">Save</button>
            </div>
        `;
        recipeList.appendChild(recipeDiv);

        const saveButton = recipeDiv.querySelector('.saveButton');
        const newImage = recipeDiv.querySelector('.recipeImage');

        saveButton.addEventListener('click', function(e) {
            console.log("Save button clicked");
            addRecipeToLocalStorage(recipe);
        });

        newImage.addEventListener('click', function(e) {
            const recipeID = e.target.dataset.id;
            fetchRecipeDetails(recipeID);
        });
    });
}

function addRecipeToLocalStorage(recipe) {
    let allRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || {};
    allRecipes[recipe.id] = recipe;
    localStorage.setItem("savedRecipes", JSON.stringify(allRecipes));
}


function loadRecipesFromLocal() {
    let allRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    allRecipes.forEach(recipe => displayRecipe(recipe));
}

function fetchRecipeDetails(recipeID) {
    const recipeInfoUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/analyzedInstructions?stepBreakdown=true'`;
    const recipeDetailUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/information`;

    fetch(recipeInfoUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log(result);
            // Clearing Old details
            document.getElementById("ingredientsList").innerHTML = '';
            document.getElementById("stepsList").innerHTML = '';

            // Retrieve the saved recipe from localStorage
            let allRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || {};
            let recipe = allRecipes[recipeID];

            if (!recipe) {
                fetch(recipeDetailUrl, options)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(recipeDetail => {
                        document.getElementById("recipeTitle").innerText = recipeDetail.title;
                        document.getElementById("recipeImage").src = recipeDetail.image;
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                document.getElementById("recipeTitle").innerText = recipe.title;
                document.getElementById("recipeImage").src = recipe.image;
            }

            result.forEach(item => {
                item.steps.forEach(step => {
                    // Adding steps to modal
                    let liStep = document.createElement("li");
                    liStep.innerText = step.step;
                    document.getElementById("stepsList").appendChild(liStep);

                    step.ingredients.forEach(item => {
                        // Adding ingredients to modal
                        let liIngredient = document.createElement("li");
                        liIngredient.innerText = item.name;
                        document.getElementById("ingredientsList").appendChild(liIngredient);
                    })
                })
            })
            document.getElementById('recipeDetailsModal').classList.add('is-active');
        })
        .catch(error => {
            console.error(error);
        });
}


document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('recipeDetailsModal').classList.remove('is-active');
});


myRecipesButton.addEventListener('click', function() {
    recipeList.innerHTML = '';

    // Load all saved recipes from local storage
    let allRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || {};
    
    // Convert object to array to use with displayResults function
    let recipeArray = Object.values(allRecipes);

    displayResults(recipeArray);
});