export default class User {
  url: string
  name: string
  pfpUrl: string
  relevance: string
  parent: { name: string; url: string }[]
  checked: boolean
  constructor(
    url: string,
    name: string,
    pfpUrl: string,
    relevance: string,
    parent: { name: string; url: string }[],
    checked: boolean
  ) {
    this.url = url
    this.name = name
    this.pfpUrl = pfpUrl
    this.relevance = relevance
    this.parent = parent
    this.checked = checked
  }
}
