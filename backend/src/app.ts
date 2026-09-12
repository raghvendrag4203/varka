import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/user.route.js'

const app = express()

// Allow the React/Vite frontend to communicate with this API
// while also allowing the authentication cookie to be sent.
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
)

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

// Health Route
app.get('/health', (_req, res) => {
    res.status(200).json({
        message: 'Health OK!',
    })
})

// user route 
app.use('/api/v1/user', userRouter)

export default app