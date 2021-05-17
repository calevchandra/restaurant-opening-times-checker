const fs = require("fs");
const luxon = require("luxon");

/**
 * This class takes the name of a JSON file containing details on opening hours
 * for a number of restaurants. It parses the contents of this file and then
 * provides a method for querying which restaurants are open at a specified date
 * and time. The input JSON file can be assumed to contain correctly formatted
 * data.
 *
 * All dates and times can be assumed to be in the same time zone.
 */
class Restaurants {
  constructor(jsonFilename) {
    const jsonData = JSON.parse(fs.readFileSync(jsonFilename));
    this.formatRestaurantData(jsonData.restaurants);
  }

  /**
   * Formats the restaurants data from the JSON file
   * @param {*} rests read from file data
   */
  formatRestaurantData(rests){
    this.restaurants = [];
    let daysAsNumberFormat = [];
    for (const rest of rests) {
      const arrOpeningHours = rest.opening_hours.split(";")

      daysAsNumberFormat = [];
      for (let val of arrOpeningHours) {
        val = val.trim();
        let firstDay = val.substring(0, 3);

        let timesOpen;
        let arrTimesOpen;

        if (val.charAt(3) === "-") {
          let lastDay = val.substring(4, 7);
          timesOpen = val.substring(7, val.length);
          arrTimesOpen = this.splitStringIntoArrayAndTrim(timesOpen);
          daysAsNumberFormat.push({ weekdays: this.getDaysOpen(firstDay, lastDay), times: arrTimesOpen });

        } else {
          timesOpen = val.substring(4, val.length);
          arrTimesOpen = this.splitStringIntoArrayAndTrim(timesOpen);
          daysAsNumberFormat.push({ weekdays: this.getDaysOpen(firstDay, null), times: arrTimesOpen });
        }
      }
      this.restaurants.push({ name: rest.name, opening_times: daysAsNumberFormat });
    }
  }
  
  splitStringIntoArrayAndTrim (strValue){
    let arrayVal = strValue.split("-");
    arrayVal[0] = arrayVal[0].trim();
    arrayVal[1] = arrayVal[1].trim();
    return arrayVal;
  }

  /**
   * Helper function to convert time (1:30pm) to 24 hours (13:30)
   * @param {*} time12h 
   * @returns 24 hours
   */
  convertTime12to24(time12h){
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier.toLowerCase() === 'pm') {
      hours = parseInt(hours, 10) + 12;
    }
     return { hours: parseInt(hours), minutes: isNaN(minutes) ? 0 : parseInt(minutes)};
  }

  /**
   * Gets days as number format that restaurant is open.
   * @param {*} firstDay 
   * @param {*} lastDay 
   * @returns days which the restaurants are open number format. For example, [0,1,2] represents Monday, Tuesday & Wednesday
   */
  getDaysOpen(firstDay, lastDay){
    let daysOpen = [];
    const firstDayAsNum = this.getDayAsNumber(firstDay);
    if (lastDay) {
      const lastDayAsNum = this.getDayAsNumber(lastDay);
      for (let i = firstDayAsNum; i <= lastDayAsNum; i++){
        daysOpen.push(i);
      }
    } else {
      daysOpen.push(firstDayAsNum);
    }
    return daysOpen;
  }

  /**
   * 
   * @param {*} day 
   * @returns day as in number form 0 - Monday , 1 - Tuesday and so on
   */
  getDayAsNumber(day){
    let dayAsNumber;
    switch (day.toLowerCase()) {
      case "mon":
        dayAsNumber = 0;
        break;
      case "tue":
        dayAsNumber = 1;
        break;
      case "wed":
        dayAsNumber = 2;
        break;
      case "thu":
        dayAsNumber = 3;
        break;
      case "fri":
        dayAsNumber = 4;
        break;
      case "sat":
        dayAsNumber = 5;
        break;
      case "sun":
        dayAsNumber = 6;
    }
    return dayAsNumber;
  }

  /**
   * Finds the restaurants open at the specified time.
   *
   * @param {luxon.DateTime} time
   * @returns {Array<string>} The names of the restaurants open at the specified
   * time. The order of the elements in this array is alphabetical.
   */
  getRestaurantsOpenAt(time) {
    let results = []
    const timeStamp = time.ts;
    const date = new Date(timeStamp);
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    
    const weekdayRestOpen = this.getDayAsNumber(days[date.getDay()]);

    for (const rest of this.restaurants) {
      for (const openingTimes of rest.opening_times){
        if (openingTimes.weekdays.includes(weekdayRestOpen)) {
          const openTimeTo24hr = this.convertTime12to24(openingTimes.times[0]);
          const closeTimeTo24hr = this.convertTime12to24(openingTimes.times[1]);

          const start = parseInt(openTimeTo24hr.hours * 60 +  openTimeTo24hr.minutes);
          const end = parseInt(closeTimeTo24hr.hours * 60 + closeTimeTo24hr.minutes);
          
          const timeToCheck = time.c.hour * 60 + time.c.minute;
            if (timeToCheck >= start && timeToCheck <= end){
              results.push(rest.name);
            }
        }
      }
    }

    return results;
  }
}

module.exports = Restaurants;
