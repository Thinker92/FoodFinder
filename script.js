const inputEl = document.getElementById("userInput");
const searchButton = document.getElementById("searchButton");
const recipeList = document.getElementById("recipeResults");

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
        <div class="card" data-id="${recipe.id}">
        <div class="card-content" data-id="${recipe.id}">
          <div class="media" data-id="${recipe.id}">
            <div class="media-left">
              <figure class="image is-128x128" data-id="${recipe.id}">
              <img class="recipeImage" src="${recipe.image}" alt="${recipe.title}" data-id="${recipe.id}">
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4" data-id="${recipe.id}">${recipe.title}</p>
            </div>
            <button class="viewButton" value="${recipe.id}">View Recipe</button>
          </div>
        </div>
      </div>
        `;
        recipeList.appendChild(recipeDiv);

        const viewButton = recipeDiv.querySelector('.viewButton');
        const cardEl = recipeDiv.querySelector('.card');

        viewButton.addEventListener('click', function(e) {
            console.log("View button clicked");
            recipeList.style.display = "None";
            // addRecipeToLocalStorage(recipe);
        });

        cardEl.addEventListener('click', function(e) {
            const recipeID = e.target.dataset.id;
            fetchRecipeDetails(recipeID);
        });
    });
}

function addRecipeToLocalStorage(recipe) {
    let allRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    allRecipes.push(recipe);
    localStorage.setItem("savedRecipes", JSON.stringify(allRecipes));
}

function loadRecipesFromLocal() {
    let allRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    allRecipes.forEach(recipe => displayRecipe(recipe));
}

function fetchRecipeDetails(recipeID) {
    const recipeInfoUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/analyzedInstructions?stepBreakdown=true'`;

    fetch(recipeInfoUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log(result);
            result.forEach(item => {
                item.steps.forEach(step => {
                    step.ingredients.forEach(item => {
                        console.log(`Ingredient: ${item.name}`);
                    })
                    console.log(`Step Text: ${step.step}`)
                })
            })
        })
        .catch(error => {
            console.error(error);
        });
}
