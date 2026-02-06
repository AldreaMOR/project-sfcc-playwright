import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
    //Access storefront SFCC
    await page.context().setDefaultNavigationTimeout(60000)
    await page.goto('https://production.sitegenesis.dw.demandware.net/s/RefArch/cowl-drape-sarong-dress/25503585M.html?lang=en_US')

    //class > button > text
    await page.locator('.modal-content').getByRole('button', {name: 'Yes' }).click()
})

test('Checking components exist in cart', async ({ page }) => {

    await expect(page.locator('.minicart-quantity').getByText('0').first()).toBeVisible()

    await page.getByLabel('Size').selectOption('12')

    await page.getByLabel('Quantity').selectOption('1') /** Error in OOTB SFCC because of pointing components manually it is failing too */
    
    await page.getByRole('button', { name: 'Select Color Black' }).click({timeout: 15000})

    await page.getByRole('button', { name: 'Add to Cart' }).click({timeout: 15000})

    await expect(page.locator('.minicart-quantity').getByText('1').first()).toBeVisible()

    await page.getByText('$118.00')

    await page.getByText('Cowl Drape Sarong Dress')

    await page.getByText('Availability: In Stock')

    await page.getByText('5 out of 5 Customer Rating')

})