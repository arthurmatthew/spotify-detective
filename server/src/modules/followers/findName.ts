import { ElementHandle } from 'puppeteer'

export const findName = async (data: ElementHandle<Element> | null) => {
  return await data
    ?.$(':scope > * a')
    .then(async (x) => await x?.getProperty('title'))
    .then(async (x) => await x?.toString())
}
