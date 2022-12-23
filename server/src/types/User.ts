export default class User {
    url: string
    name: string
    pfpUrl: string
    checked?: boolean
    constructor(
        url: string,
        name: string,
        pfpUrl: string,
        checked: boolean = false
    ) {
        this.url = url
        this.name = name
        this.pfpUrl = pfpUrl
        this.checked = checked
    }
}
