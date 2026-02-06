import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
    //Access storefront SFCC
    await page.context().setDefaultNavigationTimeout(60000)
    await page.goto('https://production.sitegenesis.dw.demandware.net/s/RefArch/home?lang=en_US')

    //class > button > text
    await page.locator('.modal-content').getByRole('button', {name: 'Yes' }).click()
})

test('Access storefront SFCC', async ({ page }) => {

    await expect(page).toHaveTitle(/RefArch/);
});

test('Search products', async ({ page }) => {
    await page.locator('.site-search').getByRole('search').click()

    const searchField = await page.locator('input[name="q"]').first()
    await searchField.fill('dress')

    await page.locator('button[type="submit"]').first().click()
    await expect(page).toHaveURL(/search/);

    await page.getByText('Results for').first().click()
    await expect(page.locator('.product-grid')).toBeVisible()

    await page.getByText('Floral Dress').first().click()
    await expect(page).toHaveURL(/product/);
})

test('Add product in cart', async ({ page }) => {
    await page.goto('https://production.sitegenesis.dw.demandware.net/s/RefArch/cowl-drape-sarong-dress/25503585M.html?lang=en_US')

    await expect(page.locator('.minicart-quantity').getByText('0').first()).toBeVisible()

    await page.getByLabel('Size').selectOption('12')

    //await page.getByLabel('Quantity').selectOption('2')

    await page.getByRole('button', { name: 'Select Color Pool' }).click()

    await page.getByRole('button', { name: 'Add to Cart' }).click()

    await expect(page.locator('.minicart-quantity').getByText('1').first()).toBeVisible()
})

test('Access cart with products', async ({ page }) => {
    await page.goto('https://production.sitegenesis.dw.demandware.net/s/RefArch/cowl-drape-sarong-dress/25503585M.html?lang=en_US')

    await page.getByLabel('Quantity').selectOption('2')

    await page.getByLabel('Size').selectOption('12')

    await page.getByRole('button', { name: 'Select Color Black' }).click()

    //test.slow()
    await page.getByRole('button', { name: 'Add to Cart' }).click()

    await page.locator('.minicart').click()
    await expect(page).toHaveURL(/cart/)
    await page.getByText('Your Cart')
})