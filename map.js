let searchBtn = document.querySelector("#search-btn");
let mapDisplay = document.querySelector("#map-display");

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  //capture user input
  let userInput = document.getElementById("map-input").value;
  console.log(userInput);

  if (userInput) {
    searchLocation(userInput);
    mapDisplay.innerHTML = "";
  } else {
    userInput.placeholder = "Please enter a city";
  }
});

let searchLocation = function (input) {
  console.log("!!!")
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
    console.log(data)
    let userCity = data.data[0].locationId;
    console.log(userCity)
    searchRestaurants(userCity);
  })
}

let searchRestaurants = function (city) {
  console.log("!!!")
  const url = 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants?locationId=' + city ;
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
    console.log(data.data.data)
  })
}
