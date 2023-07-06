import { app } from './app'
import nodeConfig from 'config'

const port = process.env.PORT || nodeConfig.get('server.port') || 3000

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
