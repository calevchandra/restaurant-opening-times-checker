const Restaurants = require("./restaurants");
const luxon = require("luxon");

const restaurants = new Restaurants("restaurant_data.json");
const rests = restaurants.getRestaurantsOpenAt(luxon.DateTime.local(2021, 5, 17 + 1, 12, 45));

console.log('restaurants that are open:', rests);