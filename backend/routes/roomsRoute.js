const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Room = require('../models/roomModel');
const Booking = require('../models/bookingModel')
const Bookingcancel =require('../models/bookingCancelModel')
const Report = require('../models/reportModel')

// todo : check validation completed  '/api/rooms/getallrooms'
// get all rooms

router.get('/getallrooms', async (req, res) => {
  try {
    const rooms = await Room.find();

    if(!rooms){
      return res.status(400).json({message : "Rooms are not found !!"})
    }

    res.status(201).send(rooms);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
});




// todo  : completed 
// get room by id

router.get('/getroombyid/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id);
    res.status(201).send(room);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server error ' });
  }
});


// todo completed 
// add room
router.post('/addroom', async (req, res) => {
  const {
    room,
    rentperday,
    maxcount,
    description,
    phonenumber,
    type,
    images
    // image1,
    // image2,
    // image3,
  } = req.body;

  // console.log('add room imge url' , images)

      // Validate required fields
      if (!room || !rentperday || !maxcount || !description || !phonenumber || !type || !images ) {
        return res.status(401).json({ error: 'All fields are required' });
      }
  


  const newroom = new Room({
    name: room,
    rentperday,
    maxcount,
    description,
    phonenumber,
    type,
    imageurls: images,
    currentbookings: [],
  });
  try {
    await newroom.save();
    res.status(201).json({message : 'New Room Added Successfully'});
  } catch (error) {
    console.log(error); 
    return res.status(500).json({ message :  'Internal  Server Error' });
  }
});


//todo completed 

router.delete('/delete-rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('here is the id ' , id)

    const result = await Room.find({ _id: id });

    // const bookingdeleted = await Booking.findOneAndDelete({roomid: result._id})
    console.log('room item details' , result.length); 
    console.log('here is room to be deleted ' , result);


    const temperIds = result.flatMap((item)=> item.currentbookings.map((item2)=> item2.bookingId.toString()))

    console.log('all temperIds', temperIds); 

    const bookingdeleted = await Booking.find({ _id : {$in : temperIds} })


    console.log('booking items length ' , bookingdeleted.length)

    const temp = bookingdeleted ; 

    const bookingIds = temp.map((item)=> item._id.toString());

    console.log('booking ids length ', bookingIds.length);

    // await Booking.deleteMany({roomid : result[0]._id}); 

    // all delete operations 

    await Room.deleteOne({ _id: id })
    await Booking.deleteMany({ _id : {$in : temperIds} })

    


    const reportedItem = await Report.deleteMany({booking : {$in : bookingIds}})

    console.log('reported item length' , reportedItem.length); 

    const cancelItem = await Report.deleteMany({bookingid : {$in : bookingIds}})

    console.log('cancel item length ' , cancelItem); 

    if (!result) {
      return res.status(400).json({ message: 'Room not found' });
    }
    res.status(201).json({message : 'Room deleted successfully', result});
  } catch (error) {
    console.log(error);
    res.status(500).json({message : 'Internal server error /delete-room'});
  }
});

module.exports = router;
