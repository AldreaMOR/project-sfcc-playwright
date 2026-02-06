import { test, expect, Locator } from '@playwright/test';

test.beforeEach(async ({page}) => {
    //Access storefront SFCC
    await page.context().setDefaultNavigationTimeout(60000)
    await page.goto('https://production.sitegenesis.dw.demandware.net/s/RefArch/cowl-drape-sarong-dress/25503585M.html?lang=en_US')

    //class > button > text
    await page.locator('.modal-content').getByRole('button', {name: 'Yes' }).click()
})

test('Add product in cart', async ({ page }) => {

    await expect(page.locator('.minicart-quantity').getByText('0').first()).toBeVisible()

    await page.getByLabel('Size').selectOption('12')

    //await page.getByLabel('Quantity').selectOption('1') /** Error in OOTB SFCC because of pointing components manually it is failing too */
    await page.getByRole('button', { name: 'Select Color Pool' }).click({timeout: 15000})

    await page.getByRole('button', { name: 'Add to Cart' }).click({timeout: 20000})

    await expect(page.locator('.minicart-quantity').getByText('1').first()).toBeVisible()
})

test('Adding product out of stock and button not enabled', async ({ page }) => {

    await page.getByLabel('Size').selectOption('14')

    await page.getByLabel('Quantity').selectOption('3')

    await page.getByRole('button', { name: 'Select Color Pool' }).click({timeout: 20000})

    await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeDisabled()
})

test('Checking components exist in cart', async ({ page }) => {

    await expect(page.locator('.minicart-quantity').getByText('0').first()).toBeVisible()

    await page.getByLabel('Size').selectOption('4')
    
    await page.getByRole('button', { name: 'Select Color Pool' }).click({timeout: 20000})

    //await page.getByRole('button', { name: 'Add to Cart' }).click()
    //to fix
    const cartButton = page.getByRole('button', { name: 'Add to Cart' });
    await expect(cartButton).toBeVisible();
    await expect(cartButton).toBeEnabled();
    await cartButton.click();

    await expect(page.locator('.minicart-quantity').getByText('1').first()).toBeVisible()

    await page.locator('.minicart').click()

    await expect(page).toHaveURL(/cart/)

    await expect(page.locator('.page-title').getByText('Your Cart')).toBeVisible()

    //await page.getByText('Your Cart')

    //await page.getByText('Cowl Drape Sarong Dress')

    await expect(page.locator('.line-item-name').getByText('Cowl Drape Sarong Dress')).toBeVisible()

    await expect.poll(async () => { 
        return page.locator('.value').nth(1).innerText()}).toBe('$118.00')
    const priceUnit = await page.locator('.value').nth(1).innerText()
    //const priceUnit = await page.getByText('$118.00').nth(3).innerText() //Each
    const priceValue = parseFloat(priceUnit.replace('$',''))

    await page.getByLabel('Quantity').nth(1).selectOption('2')

    const qtyText = await page.getByLabel('Quantity').nth(1).inputValue()
    const qtyNumber = parseInt(qtyText)

    const totalPrice = priceValue * qtyNumber
    const expectedTotalFormatted = totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    
    //to fix
    await expect.poll(async () => { 
        return page.locator('.pricing line-item-total-price-amount item-total-null').innerText()}).toBe(expectedTotalFormatted)
   // await expect(page.getByText(expectedTotalFormatted)).toContainText('$236.00')

})