import app from "./app"
import config from "./config"
import { initDB } from "./db";

const main = () => {
    initDB();
    const port = config.port
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    })
};

main();