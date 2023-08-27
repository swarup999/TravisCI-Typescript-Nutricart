//const cheerio = require('cheerio');

import { on } from "http-proxy";

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'grabItems') {
//     const items = grabItemsFromPage();
//     sendResponse(items);
//   }
// });

//Web scraping for the query
// function grabItems() {
//     console.log("grabbing items")
//     var items = [];

//     const html = document.documentElement.innerHTML;
//     console.log(html);

//     const $ = cheerio.load(html);

//     $('div.e-k008qs').each(function(i, elem) {
// 		var item = {};
//         $(this).find('img').each(function(i, elem) {
//             const alt = $(this).attr('alt');
//             const src = $(this).attr('src');
//             item['name'] = alt;
// 			item['src'] = src;
//         });
//         $(this).find('div.e-kdfzba').each(function(i, elem) {
// 			const text = $(this).text();
// 			let weight = text.match(/(\d+(?:\.\d+)?)\s*(a-zA-Z)/);
// 			item['weight'] = weight;
//         });
//         $(this).find('span.e-1u7zzcn').each(function(i, elem) {
//             const text = $(this).text();
//             let number = text.split(" ")[0];
// 			item['quantity'] = number;
//         });
// 		items.push(item);
//     });

//     return items;
// }

function grabItems() {
  console.log("grabbing items");
  var items = [];

  const divElements = document.querySelectorAll('div.e-k008qs');
  divElements.forEach(function(elem) {
      var item = {};

      const imgElement = elem.querySelector('img');
      if (imgElement) {
          console.log(imgElement);
          let alt = imgElement.getAttribute('alt');
          let src = imgElement.getAttribute('src');
          console.log(alt);
          item['name'] = alt;
          item['src'] = src;
      }

      const weightElement = elem.querySelector('div.e-kdfzba');
      if (weightElement) {
          let text = weightElement.textContent;
          let weight = text.match(/(\d+(?:\.\d+)?)\s*(a-zA-Z)/);
          item['weight'] = weight;
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
    console.log(query);

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
function onPopupOpen() {
    // Get the items from the web scraping
    // API call

    // Imagine if we use an object like this to store the user's current cart data
    var cart = {'calories': 0, 'protein': 0,'carbs': 0, 'fat': 0, 'fibre': 0};

    let items = grabItems();
    // line below is just for testing
    //let items = [{'name': 'apple', 'weight': '100g', 'quantity': '1'}, {'name': 'banana', 'weight': '100g', 'quantity': '1'}, {'name': 'orange', 'weight': '100g', 'quantity': '1'}]
    
    for (let item of items) {
        let itemValue = requestAPI(item['weight'], item['quantity'], item['name']);

        // itemValue is a promise so we need to wait for it to resolve
        itemValue.then(function(result) {
            console.log(result);
            cart = sumNutrition(result, cart);
        });
    };

    console.log(cart);
    return cart;
}

onPopupOpen();
// export default onPopupOpen;
// document.addEventListener('DOMContentLoaded', onPopupOpen);