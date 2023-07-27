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
    results.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.innerHTML = `
            <h2>${recipe.title}</h2>
            <img class="recipeImage" src="${recipe.image}" alt="${recipe.title}" data-id="${recipe.id}">
            <button class="saveButton" value="${recipe.id}">Save</button>
        `;
        recipeList.appendChild(recipeDiv);

        const saveButton = recipeDiv.querySelector('.saveButton');
        const newImage = recipeDiv.querySelector('.recipeImage');

        saveButton.addEventListener('click', function(e) {
            console.log("Save button clicked");
        });

        newImage.addEventListener('click', function(e) {
            const recipeID = e.target.dataset.id;
            fetchRecipeDetails(recipeID);
        });
    });
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
                    console.log(`Step Text: ${step.step}`)
                    step.ingredients.forEach(item => {
                        console.log(`Ingredient: ${item.name}`);
                    })
                })
            })
        })
        .catch(error => {
            console.error(error);
        });
}
