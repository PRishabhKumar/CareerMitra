import express, { json, urlencoded } from 'express'

const app = express()
app.use(json())
app.use(urlencoded({extended: true}))

app.get("/", (req, res)=>{
    res.send("This is the home/index route");
})

app.listen(3000, ()=>{
    console.log('The server is active and is listening on port number 3000');
})
