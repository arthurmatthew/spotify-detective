import { Page } from 'puppeteer'

export const findFollowers = async (page: Page) => {
  return await page
    ?.$('section[aria-label="Followers"]') // Find parent
    .then(
      async (
        x // Take the parent
      ) =>
        x !== null && // Satisfy TypeScript
        (await x
          .$('div[style]') // Find child div of parent
          .then(
            async (x) => x !== null && (await x.$$(':scope > *')) // Get all children of child
          ))
    )
}
