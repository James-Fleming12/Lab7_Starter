describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return data = item.data;
      });
    });

    /**
    **** TODO - STEP 1 ****
    */
    for (let i = 0; i < prodItemsData.length; i++) {
      const itemData = prodItemsData[i];
      if (itemData.title.length == 0) { allArePopulated = false; }
      if (itemData.price.length == 0) { allArePopulated = false; }
      if (itemData.image.length == 0) { allArePopulated = false; }
    }

    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);

  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    /**
     **** TODO - STEP 2 **** 
     */
    const productItems = await page.$$('product-item');
    
    // Inject JS to click the button and return its new text safely
    const buttonText = await page.evaluate((el) => {
      const btn = el.shadowRoot.querySelector('button');
      btn.click();
      return btn.innerText;
    }, productItems[0]);
    
    expect(buttonText).toBe('Remove from Cart');
  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    /**
     **** TODO - STEP 3 **** 
     */
    const productItems = await page.$$('product-item');
    
    // Start at i = 1 because we already clicked the 0th item in Step 2!
    for (let i = 1; i < productItems.length; i++) {
      await page.evaluate((el) => {
        el.shadowRoot.querySelector('button').click();
      }, productItems[i]);
    }

    // Get the innerText of the cart count directly
    const cartCountText = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCountText).toBe("20");

  }, 10000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    /**
     **** TODO - STEP 4 **** 
     */
    await page.reload();

    const productItems = await page.$$('product-item');
    let allButtonsSayRemove = true;

    for (let i = 0; i < productItems.length; i++) {
      const btnText = await page.evaluate((el) => {
        return el.shadowRoot.querySelector('button').innerText;
      }, productItems[i]);
      
      if (btnText !== 'Remove from Cart') {
        allButtonsSayRemove = false;
      }
    }

    expect(allButtonsSayRemove).toBe(true);

    const cartCountText = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCountText).toBe("20");

  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {

    /**
     **** TODO - STEP 5 **** 
     */
    const cartData = await page.evaluate(() => {
      return window.localStorage.getItem('cart');
    });

    expect(cartData).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');

  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    /**
     **** TODO - STEP 6 **** 
     */
    const productItems = await page.$$('product-item');
    
    // Click all 20 to remove them
    for (let i = 0; i < productItems.length; i++) {
      await page.evaluate((el) => {
        el.shadowRoot.querySelector('button').click();
      }, productItems[i]);
    }

    const cartCountText = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCountText).toBe("0");

  }, 10000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    /**
     **** TODO - STEP 7 **** 
     */
    await page.reload();

    const productItems = await page.$$('product-item');
    let allButtonsSayAdd = true;

    for (let i = 0; i < productItems.length; i++) {
      const btnText = await page.evaluate((el) => {
        return el.shadowRoot.querySelector('button').innerText;
      }, productItems[i]);
      
      if (btnText !== 'Add to Cart') {
        allButtonsSayAdd = false;
      }
    }

    expect(allButtonsSayAdd).toBe(true);

    const cartCountText = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCountText).toBe("0");

  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    /**
     **** TODO - STEP 8 **** 
     */
    const cartData = await page.evaluate(() => {
      return window.localStorage.getItem('cart');
    });

    expect(cartData).toBe('[]');

  });
});