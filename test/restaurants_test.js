const expect = require("chai").expect;
const luxon = require("luxon");

const Restaurants = require("../app/restaurants.js");

const restaurantDataFile = "./restaurant_data.json";

describe("Restaurants class", function () {
  let restaurants;

  beforeEach(() => {
    restaurants = new Restaurants(restaurantDataFile);
  });

  // Helper function that returns the restaurants open on a specific weekday
  // at a given time. Monday is weekday === 0, and Sunday is weekday === 6.
  const getRestaurantsOpenAt = ({ weekday, hour, minute = 0 }) => {
    return restaurants.getRestaurantsOpenAt(
      luxon.DateTime.local(2021, 5, 10 + weekday, hour, minute)
    );
  };

  it("reports no open restaurants at 5am on Sundays", () => {
    expect(getRestaurantsOpenAt({ weekday: 6, hour: 5 })).to.deep.equal([]);
  });

  it("reports only the Kayasa Restaurant open on Monday at 8:30 am", () => {
    expect(
      getRestaurantsOpenAt({ weekday: 0, hour: 8, minute: 30 })
    ).to.deep.equal(["Kayasa Restaurant"]);
  });

  it("reports only The Golden Duck and Tandoori Mahal open on Sunday at 9:30 pm", () => {
    expect(
      getRestaurantsOpenAt({ weekday: 6, hour: 21, minute: 30 })
    ).to.deep.equal(["The Golden Duck","Tandoori Mahal"]);
  });

  it("should return integer values for opening days passed as an array", () => {
    expect(
      restaurants.getDaysOpen('Mon', 'Thu')
    ).to.deep.equal([0,1,2,3]);
    expect(
      restaurants.getDaysOpen('tue', 'sun')
    ).to.deep.equal([1, 2, 3, 4, 5, 6]);
  });

  it("should get day as number", () => {
    expect(
      restaurants.getDayAsNumber('Fri')
    ).to.deep.equal(4);
    expect(
      restaurants.getDayAsNumber('tue')
    ).to.deep.equal(1);
  });
  
  it("should get time as 24 hr format", () => {
    expect(
      restaurants.convertTime12to24('2:00 pm')
    ).to.deep.equal({ hours: 14, minutes: 0});
  });
});
