# <img src="public/logo512.png" title="NutriCart" alt="NutriCart" width="20" height="20"/> NutriCart 

It is getting more and more popular for people to eat healthily among the young generations. Mostly due to the social media influence and other factors such as memes and gym cultures.

<p align='center'>
    <img src="https://i.ytimg.com/vi/Ux5cQbO_ybw/maxresdefault.jpg" width=300><br> 
</p>

However, it is tedious and repetitive to calculate the macronutrient intake for different needs per person every meal. 

We introduce **NutriCart** - A convenient Chrome extension that acts as a tracker and calculator when you're shopping for your groceries in [instacart](https://www.instacart.ca/store/real-canadian-superstore/storefront).

<p align='center'>
    <img src="pictures/login.png" width=400><br> 
</p>

To use this extension, you can simply set up your goals in the extension, and every time you checkout it will calculate whether this week's groceries is going to fulfill your target.  

<p align='center'>
    
</p>

<br>

# How to use this extension
1. Do your regular shopping in [instacart](https://www.instacart.ca/store/real-canadian-superstore/storefront)
<p align='center'><br><img src="pictures/instacart.png" width=400></p>

2. When you click the chekout button, if you see the pop out checkout tab, you can now click the extension button
<p align='center'>
<br><img src="pictures/instabutton.png", width=400>
<br><img src="pictures/cart.png", width=400>
<br><img src="pictures/extension.png", width=400>
</p><br>

3. If this is your first time using it, you will need to set up your user information to calculate your macro nutrient need 
<p align='center'><br><img src="pictures/open.png" width=400></p>

4. Now you should be able to see all the items in the cart and the total macro nutrients of this times' purchase
<p align='center'><br><img src="pictures/calculator.png" width=400></p>
<p align='center'><img src="pictures/front.png" width=400></p>

5. You will also see tabs that displays how much you need to add or reduce to reach your goal
<p align='center'><br><img src="pictures/goals.png" width=400></p>

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

