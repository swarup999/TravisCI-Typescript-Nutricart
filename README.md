# <img src="public/logo512.png" title="NutriCart" alt="NutriCart" width="20" height="20"/> NutriCart 

It is getting more and more popular for people to eat healthily among the young generations. Mostly due to the social media influence and other factors such as memes and gym cultures.

<p align='center'>
    <img src="https://i.ytimg.com/vi/Ux5cQbO_ybw/maxresdefault.jpg" width=300><br> 
</p>

However, it is tedious and repetitive to calculate the macronutrient intake for different needs per person every meal. 

We introduce **NutriCart** - A convenient Chrome extension that acts as a tracker and calculator when you're shopping for your groceries in [instacart](https://www.instacart.ca/store/real-canadian-superstore/storefront).

<p align='center'>
    <img src="" width=300>UI <br> 
</p>

To use this extension, you can simply set up your goals in the extension, and every time you checkout it will calculate whether this week's groceries is going to fulfill your target.  

<p align='center'>
    
</p>

<br>

# How to use this extension
1. Do your regular shopping in [instacart](https://www.instacart.ca/store/real-canadian-superstore/storefront)
<br><img src="pictures/instacart.png">
2. When you click the checkout button, if you see the pop-out checkout tab, you can now click the extension button
<br><img src="pictures/instabutton.png">
<br><img src="pictures/cart.png">
<br><img src="pictures/extension.png">
3. If this is your first time using it, you will need to set up your user information to calculate your macronutrient need 
<br><img src="kjh">
4. Now you should be able to see all the items in the cart and the total macronutrients of this time's purchase
<br><img src="kjh">
5. You will also see tabs that display how much you need to add or reduce to reach your goal
<br><img src="kjh">

<br>

# How to run this project (for developers)
1. Install the dependencies, make sure node.js and npm is installed
```
npm install 
```
2. Run the project
```
npm run build
```
3. Now go to open your Chrome browser and type `chrome://extensions/` in your search bar and turn on the developer mode
4. Click on `Load unpacked` button and select the `build` folder in the project directory
5. Now you should see the extension in your Chrome browser

