let globalVar = 12;
let cart = {'calories': 0, 'protein': 0,'carbs': 0, 'fat': 0, 'fibre': 0};
let globalCart = {'calories': 0, 'protein': 0,'carbs': 0, 'fat': 0, 'fibre': 0};
var globalItems = [];
let items = [];

function grabItemsFromHTML(html) {
  console.log("grabbing items from HTML");
  globalVar = {'calories': 0, 'protein': 0,'carbs': 0, 'fat': 0, 'fibre': 0};
  // globalCart = {'calories': 1, 'protein': 1,'carbs': 1, 'fat': 1, 'fibre': 1};
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Use DOM methods to extract information
  const divElements = tempDiv.querySelectorAll('div.e-b311fy');
  divElements.forEach(function (elem) {
    var item = {};

    const imgElement = elem.querySelector('img');
    if (imgElement) {
      let alt = imgElement.getAttribute('alt');
      let src = imgElement.getAttribute('src');
      item['name'] = alt;
      item['src'] = src;
    }

    const weightElement = elem.querySelector('div.e-kdfzba');
    if (weightElement) {
      let weight = weightElement.textContent;
      item['weight'] = weight
    }

    const quantityElement = elem.querySelector('span.e-1u7zzcn');
    if (quantityElement) {
      let text = quantityElement.textContent;
      let number = text.split(" ")[0];
      item['quantity'] = number;
    }

    items.push(item);
  });

  return items;
}

const requestAPI = async (weight, quantity, name) => {
  // weight should include unit (g, oz, etc)
  // all parameters are strings

  const query = weight + " " + name;
  quantity = parseInt(quantity)

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
      let calories = result[0].calories*quantity;
      let fat = result[0].fat_total_g*quantity;
      let protein = result[0].protein_g*quantity;
      let carbs = result[0].carbohydrates_total_g*quantity;
      let fibre = result[0].fiber_g*quantity;
      
      let nutrition = {'calories': calories, 'fat': fat, 'protein': protein, 'carbs': carbs, 'fibre': fibre};

      return nutrition; // returns object with the food's nutritional facts

    } else {
      console.error('Error: ', response.statusText);
    }
  } catch (error) {
    console.error('Error: ', error);
  }
};

const sumNutrition = (item, cart) => {
  cart['calories'] += item['calories'];
  cart['fat'] += item['fat'];
  cart['protein'] += item['protein'];
  cart['carbs'] += item['carbs'];
  cart['fibre'] += item['fibre'];

  return cart;
};

// PopupOpen 
function onPopupOpen(html) {
  // Get the items from the web scraping
  // API call

  // Imagine if we use an object like this to store the user's current cart data
  // var cart = {'calories': 0, 'protein': 0,'carbs': 0, 'fat': 0, 'fibre': 0};

  items = grabItemsFromHTML(html);
  // line below is just for testing
  //let items = [{'name': 'apple', 'weight': '100g', 'quantity': '1'}, {'name': 'banana', 'weight': '100g', 'quantity': '1'}, {'name': 'orange', 'weight': '100g', 'quantity': '1'}]
  
  for (let item of items) {
      let itemValue = requestAPI(item['weight'], item['quantity'], item['name']);

      // itemValue is a promise so we need to wait for it to resolve
      itemValue.then(function(result) {
          item['calories'] = Math.round(result['calories']);
          item['fat'] = Math.round(result['fat']*10)/10;
          item['protein'] = Math.round(result['protein']*10)/10;
          item['carbs'] = Math.round(result['carbs']*10)/10;
          item['fibre'] = Math.round(result['fibre']*10)/10;
          cart = sumNutrition(result, cart);
      });
  };

  return cart;
}

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let result;
  try {
    [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.documentElement.innerHTML,
    });
  } catch (e) {
    document.body.textContent = 'Cannot access page';
    return;
  }

  // Call the grabItemsFromHTML function with the obtained HTML
  cart = onPopupOpen(result);

  // Process the scraped items
  globalCart = cart;
  globalItems = items;
})();

