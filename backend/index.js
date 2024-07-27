
const express = require('express')
require('dotenv').config(); 
const mongoose = require('mongoose')
const cors = require('cors')
const roomsRoutes = require('./routes/roomsRoute');
const port = process.env.PORT || 3000
const userRoute = require('./routes/userRoute')
const bookingRoute = require('./routes/bookingRoute')
const bookingCancelRoute = require('./routes/bookingCancelRoute')
const reportRoute = require('./routes/reportRoute')


// app intialization 
const app = express(); 
app.use(express.json()); 
app.use(cors())

// database connection 

    mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.bc4gwnd.mongodb.net/bookingRooms`
    + '?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('connection successful'))
    .catch((error) => console.log(error));


// aplication routes 

app.use('/api/rooms',roomsRoutes)
app.use('/api/users',userRoute )
app.use('/api/bookings' , bookingRoute)
app.use('/api/bookingCancel' , bookingCancelRoute)
app.use('/api/report' , reportRoute )





// 404 error not found handler 

app.use((err , req,res,next)=>{
    res.status(404).send('Not Found')
    
})


// default error handlers 

function errorHandler(err, req,res,next){

    if(req.headersSent){
        return next(err)
    }
    return res.status(500).send({error : err})
}






// listen to port 

app.listen(port , ()=>{

    console.log(`app listening to port ${port}`)
})