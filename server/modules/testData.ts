import User from './User'

const data: Array<User> = [
    new User('Bob', 'Bob', ''),
    new User('Billy', 'Billy', ''),
    new User('Matt', 'Matt', ''),
    new User('Jeff', 'Jeff', ''),
    new User('Walt', 'Walt', ''),
]

const testData = async () => {
    return data
}

export default testData
