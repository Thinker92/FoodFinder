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
            const recipeID = e.target.dataset.id;

            console.log("View button clicked");
            // recipeList.style.display = "None";
            // fetchRecipeDetails(recipeID);
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

            let singleRecipeDiv = document.getElementById('singleRecipe');
            singleRecipeDiv.innerHTML = ''; // clear existing content

            // create a close button
            let closeButton = document.createElement('button');
            closeButton.textContent = 'X';
            closeButton.addEventListener('click', function() {
                singleRecipeDiv.style.display = 'none'; // hide single recipe
                recipeList.style.display = 'block'; // show recipe list
            });
            singleRecipeDiv.appendChild(closeButton);

            result.forEach(item => {
                // create elements for the title, ingredients, and steps
                let title = document.createElement('h1');
                title.textContent = item.name;
                singleRecipeDiv.appendChild(title);

                let ingredientsHeading = document.createElement('h1');
                ingredientsHeading.textContent = 'Ingredients:';
                singleRecipeDiv.appendChild(ingredientsHeading);

                let ingredientsList = document.createElement('ul');
                singleRecipeDiv.appendChild(ingredientsList);

                let stepsHeading = document.createElement('h1');
                stepsHeading.textContent = 'Cooking Instructions:';
                singleRecipeDiv.appendChild(stepsHeading);

                let steps = document.createElement('p');
                singleRecipeDiv.appendChild(steps);

                item.steps.forEach(step => {
                    step.ingredients.forEach(item => {
                        console.log(`Ingredient: ${item.name}`);
                        let ingredient = document.createElement('li');
                        ingredient.textContent = item.name;
                        ingredientsList.appendChild(ingredient);
                    })
                    console.log(`Step Text: ${step.step}`)
                    steps.textContent += step.step + ' ';
                })
            })

            singleRecipeDiv.style.display = 'block';
            recipeList.style.display = 'none';
        })
        .catch(error => {
            console.error(error);
        });
}
