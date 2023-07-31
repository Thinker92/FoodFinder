let searchBtn = document.querySelector("#search-btn");
let restaurantDisplay = document.querySelector("#map-display");

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
    return response.json();
  })
  .then(function (data) {
    let userCity = data.data[0].locationId;
    searchRestaurants(userCity);
  })
}

let searchRestaurants = function (city) {
  const url = 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants?locationId=' + city + '&page=1-5';
  const options = {
	  method: 'GET',
	  headers: {
		  'X-RapidAPI-Key': '943aa62b88msha1ca6ea2b408db1p1e2547jsnd725cfd16499',
		  'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
	  }
  };

  fetch(url, options)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data)
    let restaurantResults = data.data.data
    console.log(restaurantResults)
    for (var i = 0; i < restaurantResults.length; i++) {
      let restaurantId = restaurantResults[i].restaurantsId;
      getRestaurantInfo(restaurantId)
    }
  })
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
      return response.json();
    })
    .then(function (data) {
      let restaurantInfo = data
      displayOptions(restaurantInfo)
      console.log(restaurantInfo)
      console.log(restaurantInfo.data.location.name)
    })

}

let displayOptions = function(info) {
  // create card for each restaurant
  let restaurantCard = document.createElement("div");
  restaurantCard.classList.add("card", "column", "is-3", "m-2");
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

  // card image
  let cardImg = document.createElement("div");
  cardImg.classList.add("card-image");
  restaurantCard.appendChild(cardImg);
  // image content
  let cardImgSrc = document.createElement("img");
  // cardImgSrc.classList.add("image is-4by3")
  console.log(info.data.location.photo.images.original.url)
  cardImgSrc.src = info.data.location.photo.images.original.url;
  cardImg.appendChild(cardImgSrc);

  // card content
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
