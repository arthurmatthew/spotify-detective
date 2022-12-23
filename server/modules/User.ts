export default class User {
    url: string
    name: string
    pfpUrl: string
    constructor(url: string, name: string, pfpUrl: string) {
        this.url = url
        this.name = name
        this.pfpUrl = pfpUrl
    }
}
