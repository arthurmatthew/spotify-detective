export default class User {
    url: string
    name: string
    children: Array<User>
    pfpUrl: string
    constructor(
        url: string,
        name: string,
        children: Array<User>,
        pfpUrl: string
    ) {
        this.url = url
        this.name = name
        this.children = children
        this.pfpUrl = pfpUrl
    }
}
