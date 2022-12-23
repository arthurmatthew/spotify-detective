import express from 'express'
import cors from 'cors'

class AppController {
    express: express.Express
    constructor() {
        this.express = express()
        this.middlewares()
        this.routes()
    }

    middlewares() {
        this.express.use(cors())
    }

    routes() {
        this.express.use(require('./routes'))
    }
}

export default new AppController().express
