const mongoose = require('mongoose')
const express = require('express')
const router = express.Router(); 
const Report = require('../models/reportModel')
const Booking = require('../models/bookingModel')
const Room = require('../models/roomModel')



// get 

router.get('/test' , async(req,res)=>{
    res.send('ok')
})

//  post 

router.post('/reports' , async(req,res)=>{

    const {bookingId , userId} = req.body ;
    // console.log(bookingId , userId); 

    try {

        const existingReport = await Report.findOne({booking : bookingId})

       if(existingReport){
        return res.status(401).json({message : 'Your requrest already has been sent'})
       }

        const reportInfo = new Report({
            ...req.body , 
            booking : bookingId , 
            user : userId , 

        })

        const result = await reportInfo.save(); 
        if(result){
            res.status(201).json({message : 'Inserted Successfully'  , result} )
        }
        
    } catch (error) {
        console.log(error); 
        res.status(500).json({message : 'Internal Server Error'})
    }
})


// get 

router.get('/get-reports' , async(req,res)=>{


    try {

        const result = await Report.find({}).populate('booking').populate('user')

        res.status(201).send(result); 
        
    } catch (error) {
        console.log(error); 
        res.status(500).json({message : 'Internal server error'})
    }


})


// delete 

router.get('/delete-reports/:id' , async(req,res)=>{

    const {id} = req.params

    try {

       
        




        const deletedItem = await Report.findOneAndDelete({_id : id})

    


       if(deletedItem && deletedItem.booking){

        const bookingdeletedItem = await Booking.findOneAndDelete({_id : deletedItem.booking})
        // console.log(' delete one ' , bookingdeletedItem ); 

        
                if(!bookingdeletedItem){
                    return res.status(701).send({message: 'Booking not found !!!'})
                }


        const room = await Room.findById({_id : bookingdeletedItem.roomid})

        const temp = room.currentbookings; 

        const store= temp.filter((item)=> item.bookingId.toString() !== bookingdeletedItem._id.toString() )

        room.currentbookings = store ; 
        await room.save(); 


       
       } else{
        return res.status(702).json({message : "Reported not found !!! "})
       }


       res.status(201).json({message : 'Report item deleted successfully !!! '})





    } catch (error) {
        console.log(error); 
        res.status(500).json({message : "Internal server error"})
    }


})


module.exports = router; 