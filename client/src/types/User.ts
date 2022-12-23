export default class User {
    url: string
    name: string
    pfpUrl: string
    relevance: string
    checked: boolean
    constructor(
        url: string,
        name: string,
        pfpUrl: string,
        relevance: string,
        checked: boolean
    ) {
        this.url = url
        this.name = name
        this.pfpUrl = pfpUrl
        this.relevance = relevance
        this.checked = checked
    }
}
