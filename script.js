

async function getRecipes() {
    const response = await fetch('https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&number=2');
    const recipes = await response.json();
    console.log(recipes)
}

getRecipes()