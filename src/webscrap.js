const cheerio = require('cheerio');
const request = require('request');

// Web scraping for the query
function grabItems() {
    var items = [];
    const html = document.documentElement.innerHTML;

    const $ = cheerio.load(html);

    $('div.e-k008qs').each(function(i, elem) {
		var item = {};
        $(this).find('img').each(function(i, elem) {
            const alt = $(this).attr('alt');
            const src = $(this).attr('src');
            item['name'] = alt;
			item['src'] = src;
        });
        $(this).find('div.e-kdfzba').each(function(i, elem) {
			const text = $(this).text();
			weight = text.match(/(\d+(?:\.\d+)?)\s*(a-zA-Z)/);
			item['weight'] = weight;
        });
        $(this).find('span.e-1u7zzcn').each(function(i, elem) {
            const text = $(this).text();
            number = text.split(" ")[0];
			item['quantity'] = number;
        });
		items.push(item);
    });

    return items;
}

// API part of request

// PopupOpen 
function onPopupOpen() {
    // Get the items from the web scraping
    // API call

    return 0;
}

document.addEventListener('DOMContentLoaded', onPopupOpen);