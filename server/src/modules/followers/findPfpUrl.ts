import { ElementHandle } from 'puppeteer'

export const findPfpUrl = async (data: ElementHandle<Element> | null) => {
  return await data
    ?.$(':scope > * img')
    .then(async (x) => await x?.getProperty('src'))
    .then(async (x) => await x?.toString())
}
