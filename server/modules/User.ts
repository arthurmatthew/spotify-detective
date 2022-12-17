export default class User {
    url: string
    name: string
    pfpUrl: string | undefined
    children: Object | undefined
    constructor(
        url: string,
        name: string,
        pfpUrl: string | undefined,
        children: Object | undefined
    ) {
        this.url = url
        this.name = name
        this.pfpUrl = pfpUrl
        this.children = children
    }
}
