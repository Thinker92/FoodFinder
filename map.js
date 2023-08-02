const searchBtn = document.querySelector("#search-btn");
const restaurantDisplay = document.querySelector("#map-display");
const cuisineDisplay = document.getElementById("cuisine-display");
const findRecipesBtn = document.getElementById("findRecipesBtn");
//const clearCuisineBtn = document.getElementById("clear-cuisine-btn")

window.addEventListener("load", function () {
  let savedCuisines = JSON.parse(localStorage.getItem("savedCuisines"))
  console.log(savedCuisines)

  if (savedCuisines) {
    cuisineDisplay.classList.remove("is-hidden")

    let cuisineTag = document.createElement("span");
    cuisineTag.classList.add("tag", "is-info", "is-medium")
    for (var i = 0; i < savedCuisines.length; i++){
      cuisineTag.textContent += savedCuisines[i] + ', ';
    }
    cuisineDisplay.appendChild(cuisineTag);

    let clearCuisineBtn = document.createElement("button");
    clearCuisineBtn.classList.add("delete", "is-medium");
    cuisineTag.appendChild(clearCuisineBtn);

    clearCuisineBtn.addEventListener('click', function() {
      localStorage.removeItem("savedCuisines")
      cuisineDisplay.innerHTML = ''
      cuisineDisplay.classList.add("is-hidden")
    })
  }
})

if (JSON.parse(localStorage.getItem("savedCuisines"))) {
  console.log("true")
}

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  //capture user input
  let userInput = document.getElementById("map-input").value;

  if (userInput) {
    searchLocation(userInput);
    restaurantDisplay.innerHTML = "";
    document.getElementById("map-input").value = "";
  } else {
    userInput.placeholder = "Please enter a city";
  }
});

let searchLocation = function (input) {
  const url = 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchLocation?query=' + input ;
  const options = {
	  method: 'GET',
	  headers: {
		  'X-RapidAPI-Key': '943aa62b88msha1ca6ea2b408db1p1e2547jsnd725cfd16499',
		  'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
	  }
  };

  fetch(url, options)
  .then(function (response) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(function (data) {
    let userCity = data.data[0].locationId;
    searchRestaurants(userCity);
  })
}

let searchRestaurants = function (city) {
  let url1 = 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants?locationId=' + city + '&page=1';
  let url2 = 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants?locationId=' + city + '&page=2';
  let url3 = 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants?locationId=' + city + '&page=3';
  let url4 = 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants?locationId=' + city + '&page=4';
  const url = [url1, url2, url3, url4]
  const options = {
	  method: 'GET',
	  headers: {
		  'X-RapidAPI-Key': '943aa62b88msha1ca6ea2b408db1p1e2547jsnd725cfd16499',
		  'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
	  }
  };

  for (var i = 0; i < url.length; i++) {
    fetch(url[i], options)
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(function (data) {
      let restaurantResults = data.data.data
      //console.log(restaurantResults)
      for (var i = 0; i < restaurantResults.length; i++) {

        // filter by cuisine tags
        if (JSON.parse(localStorage.getItem("savedCuisines"))) {
          console.log("true")
          let savedCuisines = JSON.parse(localStorage.getItem("savedCuisines"));
          let restaurantCuisine = restaurantResults[i].establishmentTypeAndCuisineTags;
          function findMatchingRestaurants (savedCuisines, restaurantCuisine) {
            for (var i = 0; i < savedCuisines.length; i++) {
              return savedCuisines.find(cuisine => {
                return restaurantCuisine.includes(cuisine)
              })
            }
          }
          let result = findMatchingRestaurants(savedCuisines, restaurantCuisine)
          console.log(result)

          if (restaurantResults[i].establishmentTypeAndCuisineTags.includes(result)) {
            let restaurantId = restaurantResults[i].restaurantsId;
            getRestaurantInfo(restaurantId)
          }
        } else {
          let restaurantId = restaurantResults[i].restaurantsId;
          getRestaurantInfo(restaurantId)
         }
      }
    })
  }
}

let getRestaurantInfo = function(id) {
  const url = 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/getRestaurantDetails?restaurantsId=' + id + '&currencyCode=USD';
  const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '943aa62b88msha1ca6ea2b408db1p1e2547jsnd725cfd16499',
		'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
	  }
  };

  fetch(url, options)
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(function (data) {
      let restaurantInfo = data
      console.log(restaurantInfo)
      displayOptions(restaurantInfo)
    })

}

let displayOptions = function(info) {
  // create card for each restaurant
  let restaurantCard = document.createElement("div");
  restaurantCard.classList.add("card", "column", "is-3", "m-3");
  restaurantDisplay.appendChild(restaurantCard);

  // card header
  let cardHeader = document.createElement("header");
  cardHeader.classList.add("card-header", "has-background-link", "has-text-white");
  restaurantCard.appendChild(cardHeader);
  //header info
  let cardTitle = document.createElement("p");
  cardTitle.classList.add("card-header-title", "has-text-white");
  cardTitle.textContent = info.data.location.name;
  cardHeader.appendChild(cardTitle);

  let addCardBody = function () {
    let cardContent = document.createElement("div");
    cardContent.classList.add("card-content");
    restaurantCard.appendChild(cardContent);
    // content info
    let cardInfo1 = document.createElement("p");
    cardInfo1.classList.add("content");
    cardInfo1.textContent = info.data.location.address;
    cardContent.appendChild(cardInfo1);
    let cardInfo2 = document.createElement("p");
    cardInfo2.classList.add("content");
    cardInfo2.textContent = info.data.location.ranking;
    cardContent.appendChild(cardInfo2);
    // card footer
    let cardFooter = document.createElement("footer");
    cardFooter.classList.add("card-footer");
    restaurantCard.appendChild(cardFooter);
    // footer info
    let cardLink1 = document.createElement("a");
    cardLink1.href = info.data.location.web_url;
    cardLink1.classList.add("card-footer-item", "button", "is-info");
    cardLink1.textContent = "Website";
    cardFooter.appendChild(cardLink1)
  }

  if (info.data.location.photo === null || info.data.location.photo.images.original === null || info.data.location.photo.images.original.url === null) {
    addCardBody();

  } else {
    // card image
    let cardImg = document.createElement("div");
    cardImg.classList.add("card-image");
    restaurantCard.appendChild(cardImg);
    // image content figure
    let cardImgFig = document.createElement("figure")
    cardImgFig.classList.add("image", "is-3by2")
    cardImg.appendChild(cardImgFig);
    // image content src
    let cardImgSrc = document.createElement("img");
    cardImgSrc.src = info.data.location.photo.images.original.url;
    cardImgFig.appendChild(cardImgSrc);

    addCardBody();
  }
}

// link back to recipe search
findRecipesBtn.addEventListener('click', function() {
  localStorage.removeItem("savedCuisines")
  document.location.replace('./index.html'); 
});