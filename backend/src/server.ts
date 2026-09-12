import app from './app.js'
import config from './config/index.js'
import connectMongoDB from './db/mongodb/connection.js'

const { port } = config

const startServer = async() => {
    try {
        await connectMongoDB()
        app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
       }) 
    } catch (err) {
        console.error("ERROR starting the server : ", err)
        process.exit(1)
    }
}

startServer()