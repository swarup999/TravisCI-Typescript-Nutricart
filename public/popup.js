function grabItemsFromHTML(html) {
  console.log("grabbing items from HTML");
  var items = [];

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
  const items = grabItemsFromHTML(result);

  // Process the scraped items
  console.log(items);
})();

