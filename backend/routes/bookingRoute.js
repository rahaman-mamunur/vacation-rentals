const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/bookingModel');
const moment = require('moment');
const Room = require('../models/roomModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');
const Report = require('../models/reportModel')
const Bookingcancel = require('../models/bookingCancelModel')



//todo compeleted 
// post booking

router.post('/bookroom', async (req, res) => {
  const { room, fromdate, todate, totalDays, totalAmount, user, token } =
    req.body;

  try {

     // payment gateway

    // create customer

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // charging from customer
    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        currency: 'bdt',
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    if (payment) {
      try {
        if (
          !moment(fromdate, 'DD-MM-YYYY').isValid() ||
          !moment(todate, 'DD-MM-YYYY').isValid()
        ) {
          throw new Error('Invalid date format');
        }

        // Create a new booking
        const newBooking = new Booking({
          userid: user._id,
          room: room.name,
          email : user.email,
          roomid: room._id,
          totalDays: totalDays,
          fromdate: fromdate,
          todate: todate,
          totalAmount: totalAmount,
          transactionId: payment.id,
          paymentStatus : 'pending',
          status: 'pending',
        });

        // Save the booking
        const booking = await newBooking.save();

        // Find the room and push booking data into currentbookings array
        const roomtemp = await Room.findOneAndUpdate(
          { _id: room._id },
          {
            $push: {
              currentbookings: {
                bookingId: booking._id,
                fromdate: fromdate,
                todate: todate,
                userid: user._id,
                transactionId: booking.transactionId,
                paymentStatus: booking.paymentStatus,
                status: booking.status,
              },
            },
          },
          { new: true } 
        );

        if (!roomtemp) {
          res.status(401).json({message : 'Room not found'});
        }

        res.status(201).json({message : 'Your Room has been booked succeessfully!'});
      } catch (error) {
        console.log(error);
        res.status(403).json({message : 'Bookinf Inserted failed'});
      }
    }else{

      res.status(402).json({ message: 'Payment processing failed' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message :  'Internal Server Error'});
  }
});




//get all user bookings


router.post('/getuserbookings', async (req, res) => {
  const { userid } = req.body;

  try {
    const bookings = await Booking.find({ userid: userid });


    const updatedBookings = []

    for(const item of bookings){


    

      const currentTime = moment(); 
      const updatedTime = moment(item.createdAt).add(20  , 'minutes')
      
     const  checkCancelTime =  updatedTime.isSameOrAfter(currentTime);
     
   

  const currentDate = moment();
  const checkInDate = moment(item.fromdate, 'DD-MM-YYYY');

  

  if (!checkInDate.isValid()) {
    return res.status(400).json({message : "Invalid check-in date format"});
  }

  const updatedDate = checkInDate.subtract(1, 'days');

  const checkCancelDate = currentDate.isSameOrBefore(updatedDate, 'day');

  // console.log('check chance date ' , checkCancelDate); 
  const cancellationDeadline = updatedDate.format('DD-MM-YYYY')
  // console.log('cancellation date dead line ' , cancellationDeadline)
  
    

    const updater = await Booking.findOneAndUpdate(
      { _id : item._id},
      {
        $set : {checkCancelDate : checkCancelDate , cancellationDeadline : checkCancelDate ? cancellationDeadline  : 'Expired'}
      },
      {
        new : true
      }
    )

    updatedBookings.push(updater); 

    }




  res.send(updatedBookings)


  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});




// get all bookings 

router.get('/getallbookings' , async(req,res)=>{
  
  try {
    
    const result = await Booking.find(); 
    if(result){
      res.status(201).send(result)
    }
    
  } catch (error) {
    console.log(error); 
    res.status(500).send('Internal server error - /getallbookings')
  }
  
  
})



// booking status updated 

router.patch('/booking-status/:id' ,async(req,res)=>{

  try {
    const {id} = req.params; 

    const updatedRoomStatus = await Booking.findOneAndUpdate(

      {
        _id : id
      },
      {
        $set : {paymentStatus : 'received' , status : 'booked'}
      },
      {
        new : true
      }
    )

    if(!updatedRoomStatus){
      return res.status(400).send({error : 'Bookings not found'})
    }

    res.status(201).send(updatedRoomStatus); 
    
  } catch (error) {
    console.log(error); 
    res.status(500).status('Internal server error /booking-status')
  }

})






// cancel booking 

router.post('/cancelbooking', async (req, res) => {
  const { bookingid, userid, roomid } = req.body;

  // console.log('/cancelbooking',bookingid , userid , roomid); 

 

  try {
    const bookingitem = await Booking.findOneAndUpdate(
      { 
        _id: bookingid
      },

      {
        $set: { status: 'cancelled' },
      },
      {
        new: true,
      }
    );

    if(!bookingitem){
      return res.status(408).json({message : 'Booking not found'})
    }
    
    const room = await Room.findOne({_id:roomid})

    if(!room){
      return res.status(401).json({message : 'Rooom not found'})
    }
    
    const bookings = room.currentbookings


    if ( !bookings || bookings.length === 0) {  
      return res.status(403).json({message : 'No bookings found for the room'});
    }



    const bookingExistingInRoom = bookings.some((item)=> item.bookingId.toString() === bookingid )


    // console.log('bookingExistingInRoom' , bookingExistingInRoom)


    if(!bookingExistingInRoom){
      return res.status(409).json({ message: 'Booking not found in the room' })
    }


    const temp=bookings.filter(booking=>booking.bookingId.toString()!==bookingid)


    room.currentbookings=temp;
    await room.save()




    const deleteItem = await Booking.deleteOne({_id : bookingid}); 

    if(deleteItem.deleteCount === 0){
     res.status(400).json({message : 'No bookings found'})
    }


    const existingReport = await Report.findOne({booking : bookingid})

    if(existingReport){
      const deleteReportItem = await Report.deleteOne({booking : bookingid})

      if(deleteReportItem.deleteCount === 0){
    res.status(700).json({message : 'No report bookings found'})
      }

    }


   
  

    res.status(201).json({message : 'Your Room has been Cancelled successfully!'});


  } catch (error) {
    console.log(error);
    res.status(500).json({message : 'Internal server error'});
  }
});


//  cancel deadline 

router.get('/cancel-deadline/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bookingInfo = await Booking.findOne({ _id: id });

    if (!bookingInfo) {
      return res.status(403).json({message : "Booking not found"});
    }



  

  const currentDate = moment();
  const checkInDate = moment(bookingInfo.fromdate, 'DD-MM-YYYY');

  

  if (!checkInDate.isValid()) {
    return res.status(400).json({message : "Invalid check-in date format"});
  }

  const updatedDate = checkInDate.subtract(1, 'days');

  const checkCancelDate = currentDate.isSameOrBefore(updatedDate, 'day');

  
  const cancellationDeadline = updatedDate.format('DD-MM-YYYY')


   const updater = await Booking.findOneAndUpdate(
    { _id : id},
    {
      $set : {checkCancelDate : checkCancelDate , cancellationDeadline : checkCancelDate ? cancellationDeadline  : 'Expired'}
    },
    {
      new : true
    }
  )




    res.status(200).send(updater); 



  } catch (error) {
    console.log(error);
    res.status(500).json({message : 'Internal server error '});
  }
});




// delete booking by id (admin)

router.delete('/delete-bookings/:id' , async(req,res)=>{


  const {id} = req.params ; 

  try {

    const result = await Booking.findOneAndDelete({_id : id})


    const room = await Room.findOne({_id : result.roomid})


    if(!room){
      return res.status(401).json({message : 'Rooom not found'})
    }

    const bookings = room.currentbookings

    if ( !bookings || bookings.length === 0) {  
      return res.status(403).json({message : 'No bookings found for the room'});
    }

    const store = bookings.filter((item)=> item.bookingId.toString() !== id )

    room.currentbookings = store 

    await room.save(); 


    const cancelItem = await Bookingcancel.findOneAndDelete({bookingid : result._id}) 

    // console.log('cancel item' , cancelItem); 


    const reqItem = await Report.findOneAndDelete({booking : result._id})

    // console.log('req deleted item' , reqItem);

    if (!result) {
      return res.status(400).json({ message: 'Booking not found' });
    }

  
    res.status(200).json({result , message : 'Booking deleted successfully' }); 
    
  } catch (error) {
    console.log(error); 
    res.status(500).json({message : 'Internal server error '});
  }



})



module.exports = router;

