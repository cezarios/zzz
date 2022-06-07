require('dotenv').config()
const dotenv = require('dotenv')
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const passport = require('passport')
const router = require('./router/main-router')

dotenv.config();

require('./controller/passport')(passport)


const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.static('public'))
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret:process.env.SECRET,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        ttl: 7 * 24 *  60 * 60, // 7 Days
    }),
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs')

app.use(passport.initialize());
app.use(passport.session());

const start = async () => {
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, () => console.log("http://localhost:" + PORT))
    }
    catch (e){
        console.log(e)
        process.exit(1)
    }
}

app.use(router)

start()