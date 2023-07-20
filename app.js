// express mongoosee jsonwebtoken bcrypt

//import dependencies
require("./config/database").connect()
const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

//import model(user)
const User = require("./model/user")

const app = express()
app.use(express.json()) //middlware
app.use(express.urlencoded({extended: true}))

app.get("/" , (req, res) => {
    res.send("hello auth system")
})

app.post("/register", async(req, res) => {
    try {
        //collect all information
        const {fname,lname,email,password} = req.body;
        //validate data if exist
        if(!(email && password && fname && lname)){
            res.status(402).send("all fields are required")
        }
        //check email in correct format


        //check if user exist
        const existingUser = await User.findOne({ email })
        if(existingUser){
            res.status(401).send("User already exist in database")
        }

        //encrypt the password
        //becrypt - take string convert into hash store in db ,user login insert same dtring we encrypt nd match from db
        const myEncyPassword = await bcrypt.hash(password , 10); // 10 is salt

        //create a new entry in db
        const user = await User.create({
            firstname : fname ,
            lastname : lname ,
            email: email,
            password: myEncyPassword,
        })
        //create a token and send to user
        //jwt - shhh is secret 
        //token has 3 things(header[type:jwt],payload{create object and pass info as much},signature[when it expire , secret like base64])
        const token = jwt.sign({
            id: user._id , email
        },'shhhh',{expiresIn: '2h'})

        user.token = token
        //dont want to send password
        user.password = undefined
        res.status(201).json(user)

    } catch (error) {
        console.log(error);
        console.log("error in response route");
    }
})

app.post("/login" , async(req , res) => {
    try {
        //collect info from frontend
        const {email , password} = req.body
        //validate
        if(!(email && password)){
            res.status(401).send("email or password is required")
        }
        //check user in db
        const user = await User.findOne({email})
        //match the password
        if(user && ( await bcrypt.compare(password, user.password))){
            const token = jwt.sign({id: user._id, email} , 'shhhh' , {expiresIn: '2h'} )

            user.password = undefined
            user.token = token

            //cookie construction
            const options = {
                expires : new Date(Date.now() + 5 *24 * 60 * 60 *1000 ),
                httpOnly : true
            }
            res.status(200).cookie('token' , token , options ).json({
                success: true,
                token,
                user
            })
        }
        //create token and send
        

    } catch (error) {
        console.log(error);
        res.sendStatus(400).send("email and password is incorrect")
    }
})