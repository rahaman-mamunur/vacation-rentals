const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Bookingcancel = require('../models/bookingCancelModel');
const Booking = require('../models/bookingModel')
const Room = require('../models/roomModel')

// get

router.get('/', async (req, res) => {
  res.send('incominggggggggg..!!!');
});



// post method

router.post('/bookingCancel', async (req, res) => {
  const {
    bookingid , userId
  } = req.body;

  if (!bookingid  ) {
    return res.status(400).send('Missing required fields..!!');
  }

  try {
    const existingRequest = await Bookingcancel.findOne({
      bookingid,
     
    });
    if (existingRequest) {
      return res
        .status(409)
        .send('A booking cancellation with these details already has been sent.');
    }

    const newbookingCancel = new Bookingcancel({
    
        ...req.body , 
        bookingInfo : bookingid,
        user: userId
    });


    await newbookingCancel.save();

    res
      .status(201)
      .send("Cancellation request received. We'll update you soon.");
  } catch (error) {
    console.log(error);
    console.error('Error processing booking cancellation ' , error); 
    res.status(500).send('Internal server error /bookingcancel');
  }
});


// get all request of cancellation 

router.get('/reqofcancellation' , async(req,res)=>{

    try {
        
        const reqofcancellation = await Bookingcancel.find({}).populate('bookingInfo'); 

        res.status(201).send(reqofcancellation); 


    } catch (error) {
        console.log(error); 
        res.status(500).send('Internal server error')
    }

})



// delete one req cancel items

router.post('/reqofcancellation-accepted' , async(req,res)=>{


    const {id , bookingid  , roomid  } = req.body; 

    try {


        
        const cancellationReq = await Bookingcancel.findOneAndDelete({_id : id  })

        if(!cancellationReq){
          return res.status(701).json({message : 'Requested item not found !!!'})
        }



        const bookingdeletedItem = await Booking.findOneAndDelete( {_id : bookingid} )

        if(!bookingdeletedItem){
          return res.status(702).json({message : 'Bookings not found !!!'})

        }


        const room = await Room.findById({_id : bookingdeletedItem.roomid})

        if(!room){
          return res.status(703).json({message : 'Room not found !!!'})
        }

        const temp = room.currentbookings

        const store = temp.filter((item)=> item.bookingId.toString() !== bookingdeletedItem._id.toString())

        room.currentbookings = store ;

        await room.save(); 


        res.status(201).send('Booking and cancellation records deleted successfully')
    


    } catch (error) {
        console.log(error); 
        res.status(500).send('Internal server Error')
    }

})


module.exports = router;
