import { ElementHandle } from 'puppeteer'

export const findUrl = async (data: ElementHandle<Element> | null) => {
  return await data
    ?.$(':scope > * a')
    .then(async (x) => await x?.getProperty('href'))
    .then(async (x) => await x?.toString())
}
