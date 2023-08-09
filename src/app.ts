import "dotenv/config";
import  express, {Application} from "express";
import { startDatabase } from "./database";
import logics from "./logics";
import { idExists, nameExists } from "./middlewares";

const app: Application = express();
app.use(express.json())

app.post("/movies",nameExists, logics.create)
app.get("/movies",logics.read)

app.get("/movies/:id" ,idExists, logics.retrieveMovie )
app.patch("/movies/:id", idExists, nameExists,logics.update)
app.delete("/movies/:id",idExists, logics.deleteMovie)

const PORT: number = 3000
app.listen(PORT, async(): Promise<void> => {
    await startDatabase()
})