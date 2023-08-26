// Imagine if we use an object like this to store the user's current cart data
let cart = {calories: 0, protein: 0,carbs: 0, fat: 0, fibre: 0};
// then another object to store the user's recommended nutrition
// let recommended = calculateNutrition()

// for each time in the cart we send a request to the API and then add the result to the cart

const requestAPI = async (weight, quantity, name) => {
    // weight should include unit (g, oz, etc)
    // all parameters are strings

    const query = weight + " " + quantity + " " + name;
    try {
      const response = await fetch(
        'https://api.api-ninjas.com/v1/nutrition?query=' + query,
        {
          method: 'GET',
          headers: {
            'X-Api-Key': 'm8Av39tZ4NwKsuXmjZmnNQ==WdaIx6ioJ0QM7o6d',
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        let calories = result[0].calories;
        let fat = result[0].fat_total_g;
        let protein = result[0].protein_g;
        let carbs = result[0].carbohydrates_total_g;
        console.log(calories, fat, protein, carbs);

        let nutrition = {calories: calories, fat: fat, protein: protein, carbs: carbs};

        return nutrition; // returns object with the food's nutritional facts

      } else {
        console.error('Error: ', response.statusText);
      }
    } catch (error) {
      console.error('Error: ', error);
    }
};
  
// example requestAPI('100g', 1, 'apple');

// function to calculate the nutrition that the user should consume
// weight is in kg, height is in cm, age is in years. protein, carbs, fat, and fibre are in grams
const calculateNutrition = (gender, weight, height, age, calories, protein, carbs, fat, fibre) => {
    let bmr;
    // calculate BMR (basal metabolic rate) which is the number of calories burned at rest
    if (gender == "Male") {
        let bmr = 13.397 * weight + 4.799 * height - 5.677 * age + 88.362;
    } else {
        let bmr = 9.247 * weight + 3.098 * height - 4.33 * age + 447.593;
    }

    if (calories != null) {  // is user doesnt specifiy calories, we calculate it for them
        calories = bmr;
    };

    if (protein != null) {
        protein = (calories * 0.2)/4; // calculates protein in grams
    };

    if (fat != null) {   // calculates fat in grams
        fat = (calories * 0.3)/9;
    };

    if (carbs != null) {  // calculates carbs in grams
        carbs = (calories * 0.5)/4;
    };

    if (fibre != null) {  // calculates fibre in grams
        fibre = (calories/1000)*14;
    }

    // returns an object with all the nutrition values that the user should consume
    return {calories: calories, protein: protein, carbs: carbs, fat: fat, fibre: fibre};
}
const getProteins = () => {
  //fake api call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(testProteins);
    }, 2000);
  });
}

const emptyObject = {
  "type": undefined, 
  "total": undefined,
  "expected": undefined,
  "list": [
  ]
}

const testProteins = 
{
  "type": "protein",
  "total": 99,
  "expected": 100,
  "list": [
      {
        "name" : "costco chicken thigh",
        "weight": 3.8,
        "src" : "https://placehold.co/85",
        "total": 14
      },
      {
        "name" : "beef",
        "weight": 3.8,
        "src" : "https://placehold.co/85",
        "total": 14

      }
    ]
  }
const getProteinTotal = () => 12;
export {getProteins, getProteinTotal, emptyObject};