import app from "./app.js"
import config from "./config/index.js"

const main = () => {
    const port = config.port
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    })
};

main();