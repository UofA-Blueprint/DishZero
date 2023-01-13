import express from 'express'
import dotenv from "dotenv"

// routes
import scheduledJobsRouter from "./routes/scheduledJobs.js";

// Load the env variables
dotenv.config()
const app = express()
const port = process.env.PORT || 3001

// Scheduled Jobs Routes
app.use('/scheduledJobs', scheduledJobsRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})