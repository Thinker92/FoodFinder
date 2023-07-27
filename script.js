const inputEl = document.getElementById("userInput");
const searchButton = document.getElementById("searchButton");


const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '25c699ff54msh434da319c653bbdp1fc1d3jsnf90a41af76ed',
        'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
    }
};
searchButton.addEventListener('click', function(){
    const userInput = encodeURIComponent(inputEl.value.trim())
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
        const recipeList = document.getElementById("recipeResults");
        result.results.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            
            recipeDiv.innerHTML = `
                <h2>${recipe.title}</h2>
                <img src="${recipe.image}" alt="${recipe.title}">
            `;
            recipeList.appendChild(recipeDiv);
        })
    })
    .catch(error => {
        console.error(error);
    });
})




// let recipeID;
// const recipeInfoUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/information`;


// fetch(recipeInfoUrl, options)
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.text();
//     })
//     .then(result => {
//         console.log(result);
//     })
//     .catch(error => {
//         console.error(error);
//     });