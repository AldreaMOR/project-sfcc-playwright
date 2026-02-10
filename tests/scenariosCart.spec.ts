import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
    //Access storefront SFCC
    await page.context().setDefaultNavigationTimeout(60000)
    await page.goto('https://production.sitegenesis.dw.demandware.net/s/RefArch/cowl-drape-sarong-dress/25503585M.html?lang=en_US')

    //class > button > text
    await page.locator('.modal-content').getByRole('button', {name: 'Yes' }).click()
})

test('Add product in cart using while', async ({ page }) => {

    await expect(page.locator('.minicart-quantity').getByText('0').first()).toBeVisible()

    await page.getByLabel('Size').selectOption('6')

    //await page.getByLabel('Quantity').selectOption('2') /** Error in OOTB SFCC because of pointing components manually it is failing too */
    
    await page.getByRole('button', { name: 'Select Color Pool' }).click({timeout: 15000})
    
    // Get initial stock status
    let stockText = (await page.locator('.availability-msg').innerText()).trim()
    console.log('Initial stock:', stockText)

    // Max attempts to avoid infinite loops
    const MAX_ATTEMPTS = 10
    let attempts = 0

    while (stockText !== 'Availability: In Stock' && attempts < MAX_ATTEMPTS) {
        attempts++
        console.log(`Attempt ${attempts} - Product still not in stock`)

        await page.getByLabel('Size').selectOption('4')
        await page.getByLabel('Size').selectOption('6')
        await page.getByRole('button', { name: 'Select Color Pool' }).click()

        // Update existing variable, DO NOT redeclare
        stockText = (await page.locator('.availability-msg').innerText()).trim()
        console.log('Updated stock:', stockText)
    }

    // If stock never became available
    /*if (stockText !== 'Availability: In Stock') {
        throw new Error(`Product did not become available after ${MAX_ATTEMPTS} attempts`)
    }*/

    // Success – add to cart
    await page.getByRole('button', { name: 'Add to Cart' }).click({ timeout: 20000 })
    await expect(page.locator('.minicart-quantity').getByText('1').first()).toBeVisible()

})

test('Add product in cart', async ({ page }) => {

    await expect(page.locator('.minicart-quantity').getByText('0').first()).toBeVisible()

    await page.getByLabel('Size').selectOption('6')

    await expect.poll(async () => {
        return await page
        .getByLabel('Size')
        .locator('option:checked')
        .getAttribute('data-attr-value')
    }, { timeout: 30000}).toBe('006')

    await page.getByLabel('Quantity').selectOption('2') /** Error in OOTB SFCC because of pointing components manually it is failing too */
    
    await expect.poll(async () => {
        return await page
        .getByLabel('Quantity')
        .locator('option:checked')
        .getAttribute('value')
    }, { timeout: 30000}).toBe('2')

    await page.getByRole('button', { name: 'Select Color Pool' }).click({timeout: 30000})
    
    // Aguarda que o texto da <li> dentro de .availability-msg mude para "In Stock"
    /*await expect.poll(async () => {
        const txt = await page.locator('.availability-msg').innerText()
        return txt.trim()
    }, { timeout: 20000}).toBe('In Stock')*/
    
    //to fix
    await expect.poll(async () => {
        return await page
        .locator('.availability-msg')
        .innerText()
    }, { timeout: 20000}).toBe('In Stock')

    // Success – add to cart
    await page.getByRole('button', { name: 'Add to Cart' }).click({ timeout: 20000 })
    await expect(page.locator('.minicart-quantity').getByText('1').first()).toBeVisible()

})

test('Adding product out of stock and button not enabled', async ({ page }) => {

    await page.getByLabel('Size').selectOption('14')

    await page.getByLabel('Quantity').selectOption('3')

    await page.getByRole('button', { name: 'Select Color Pool' }).click({timeout: 20000})

    await expect(page.getByText('Availability: Select Styles for Availability')).toBeVisible()

    await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeDisabled()
})

test('Checking components exist in cart', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.minicart-quantity').getByText('0').first()).toBeVisible() //confirm there is minicart without products add
    
    await page.getByLabel('Size').nth(0).selectOption('6') //Select the value 4 for size

    //await page.getByLabel('Quantity').nth(0).selectOption('2') //Select the value 2 for quantity

    await page.getByRole('button', { name: 'Select Color Pool' }).click() //Choose color, clicking in the button

    const qtyText = await page.getByLabel('Quantity').nth(0).inputValue()  //Get the value in quantity and convert to number

    //await page.getByRole('button', { name: 'Add to Cart' }).click()
    //to fix

    const cartButton = page.getByRole('button', { name: 'Add to Cart' })

    await expect(cartButton).toBeEnabled({timeout: 20000})

    await expect.poll(async () => cartButton.isEnabled()).toBe(true)

    await cartButton.click()

    await expect(page.locator('.minicart-quantity').getByText(qtyText).first()).toBeVisible() //confirm there is minicart with products add

    await page.locator('.minicart').click() //goto minicart

    await expect(page).toHaveURL(/cart/)

    await expect(page.locator('.page-title').getByText('Your Cart')).toBeVisible() //Confirm the title of cart is visible

    await expect(page.locator('.line-item-name').getByText('Cowl Drape Sarong Dress')).toBeVisible() //Confirm the title product is visible

    await expect.poll(async () => { 
        return page.locator('.value').nth(1).innerText()}).toBe('$118.00') //Checking the price unit is visible
    const priceUnit = await page.locator('.value').nth(1).innerText()
    //const priceUnit = await page.getByText('$118.00').nth(3).innerText() //Each
    const priceValue = parseFloat(priceUnit.replace('$','')) //Convert the string to a number

        await page.getByLabel('Quantity').nth(0).selectOption('2') //Select the value 2 for quantity

    const qtyText2 = await page.getByLabel('Quantity').nth(1).inputValue()  //Get the value in quantity in cart and convert to number
    const qtyNumber = parseInt(qtyText2)

    const totalPrice = priceValue * qtyNumber //Calcule the total price based on quantity and price unit
    const expectedTotalFormatted = totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) //Format the total price in currency
    
    //to fix
    await expect.poll(async () => { 
        return page.locator('.pricing line-item-total-price-amount item-total-null').innerText()}).toBe(expectedTotalFormatted) //Conform the total price is visible
   // await expect(page.getByText(expectedTotalFormatted)).toContainText('$236.00')

})