import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
    //Access storefront SFCC
    await page.context().setDefaultNavigationTimeout(60000)
    await page.goto('https://production.sitegenesis.dw.demandware.net/s/RefArch/cowl-drape-sarong-dress/25503585M.html?lang=en_US')

    //class > button > text
    await page.locator('.modal-content').getByRole('button', {name: 'Yes' }).click()
})

test('Add product in cart', async ({ page }) => {

    await expect(page.locator('.minicart-quantity').getByText('0').first()).toBeVisible()

    await page.getByLabel('Size').selectOption('6')

    //await page.getByLabel('Quantity').selectOption('2') /** Error in OOTB SFCC because of pointing components manually it is failing too */
    
    await page.getByRole('button', { name: 'Select Color Pool' }).click({timeout: 15000})
    //to fix
    //await expect(page.locator('.list-unstyled availability-msg')).toHaveText('Availability: In Stock') //Adicionar um for para tentar novamente ao mudar de opção e voltar ao anterior e tentar novamente.
await expect(
  page.locator('li:has-text("Availability: In Stock")')
).toBeVisible();

    await page.getByRole('button', { name: 'Add to Cart' }).click({timeout: 20000})

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