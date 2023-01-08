export default class User {
  url: string
  name: string
  pfpUrl: string
  parent?: { name: string; url: string }[]
  checked?: boolean
  constructor(
    url: string,
    name: string,
    pfpUrl: string,
    parent: { name: string; url: string }[] = [{ name: '', url: '' }],
    checked: boolean = false
  ) {
    this.url = url
    this.name = name
    this.pfpUrl = pfpUrl
    this.parent = parent
    this.checked = checked
  }
}
