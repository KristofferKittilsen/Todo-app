import express from "express"
import indexRoutes from "./routes";
import taskRoutes from "./routes/task";
import "./db/mongoose"
import userRoutes from "./routes/user";
import passport from "passport"
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors"
import cookieParser from "cookie-parser"
import tableRoutes from "./routes/table";


const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
)
app.use(
    session({
        secret: "this is a useless sentence to encrypt my cookies",
        resave: true,
        saveUninitialized: true
    })
)

passport.serializeUser(function(user, done){
    done(null, user)
})

passport.deserializeUser(function(user: any, done){
    done(null, user)
})

app.use(cookieParser("this is a useless sentence to encrypt my cookies"))
app.use(passport.initialize())
app.use(passport.session())
require("./middleware/passportConfig")(passport)

app.use("/api/index", indexRoutes)
app.use("/api/tables", tableRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/users", userRoutes)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

export default app