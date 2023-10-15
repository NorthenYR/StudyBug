/* A utility module that validate the environment variable of the application. */
import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators"

export default cleanEnv(process.env, {
    MONGO_CONNECT: str(), 
    PORT: port(),
    SESSION_SECRET: str(),
})