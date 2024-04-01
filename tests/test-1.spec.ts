import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(async () => window.remoteDict.fetch('food'))
});

test('fetch', async ({ page }) => {
  const fetchResult = await page.evaluate(async () => {
    return window.remoteDict.fetch('food');
  })
  expect(fetchResult).toHaveLength(4);
});

test('treeLabel', async ({ page }) => {
  const treeLabelResult = await page.evaluate(async () => {
    return window.remoteDict.treeLabel('food', 12);
  });
  expect(treeLabelResult).toBe('🍕披萨-🍍菠萝披萨');
});
