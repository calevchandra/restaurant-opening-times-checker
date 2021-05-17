# Coding Test - Open Restaurants

## Specification

Reading a JSON file that contains data describing the opening
times of a number of restaurants, which then provides a method for querying
which of the restaurants are open at a specified date and time.

## To run the application 
First do `npm i` to install the packages and to run sample code do `node app/index.js`
This will run index.js. You may change the dates everytime you want to test different aspects/opening times and run `node app/index.js` again. Running tests would be more sufficient. See below

## Testing Data
You can run `npm test` in terminal to test the code

## Summary 
The app uses a basic architecture by using one class - Restaurants from where all methods are accessed. I have read and formatted the data in the simplest possible form to query. This helps in finding issues early rather than leaving formatting to the last minute. Moreover, I have used helper functions to not reinvent the wheel and also just separating logic into different functions. This would help in testing and refactoring should someone new jump in to change the code. 

Important methods have been given descriptions to provide and overview of the function and it's purpose. 

An improvement that could be done later on is using typescript to ensure that data is in a specific format rather than having to parse to integer etc in functions. 



