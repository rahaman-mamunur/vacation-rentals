const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const capitalizeName = require('../utils/capitalizeName');
const Booking = require('../models/bookingModel')
const Room= require('../models/roomModel')
const Request = require('../models/bookingCancelModel')
const Report = require('../models/reportModel')


// todo : compeleted 
// post registration

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, cpassword  } = req.body;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists. Please use a different email address." });
    }


    if(password !== cpassword){
      return res.status(400).json({message: "Passwords do not match." })
    }



    const newUser = new User({

      name : capitalizeName(name),
      email,
      password , 
      cpassword,


    });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});



// google register 

router.post('/google-register' , async (req,res)=>{

  const {name , email} = req.body; 

  try {
    

    const existingUser = await User.findOne({email : email})

    // console.log('existing user of google register ' , existingUser)
    

   
    if(!existingUser){
      const newGoogleUser = new User ({

        name : capitalizeName(name),
        email,
      })
      
      await newGoogleUser.save(); 
    }
    
    res.status(201).send(existingUser); 




  } catch (error) {
    console.log(error); 
    res.status(500).json({message :  'Internal server error'})
  }

})

//todo : compeleted 
// login
router.post("/login", async(req, res) => {

  const {email , password} = req.body

  try {
      
      const user = await User.find({email , password})

      if(user.length > 0)
      {
          const currentUser = {
              name : user[0].name , 
              email : user[0].email, 
              isAdmin : user[0].isAdmin, 
              _id : user[0]._id
          }
          res.send(currentUser);
      }
      else{
          return res.status(400).json({ message: 'Invalid Credentials' });
      }

  } catch (error) {
         return res.status(500).json({ message: 'Internal Server error' });
  }

});



// todo completed 
// get all users 

router.get('/getallusers' , async(req,res)=>{

  try {

    const result = await User.find()

    if(!result || result.length === 0){
      return res.status(400).json({message : 'No Users found'})
    }

    res.status(201).send(result); 
    
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error /getallusers')
  }

})




// todo completed 

// update admin access status 

router.patch('/admin-status/:id' , async(req,res)=>{

  const {id} = req.params; 

  try {

    const result = await User.findOneAndUpdate(
      
      
      {_id : id} , 
    
     { $set : {
        isAdmin : true
      }
    
    } , 
      {
        new : true
      }
    
    )

    if(!result || result.length === 0){
      return res.status(401).json({message : "No users found !!! "})
    }


    res.status(201).json({message : 'Admin Status Updated' , result})
    
  } catch (error) { 
    console.log(error); 
    res.status(500).json({message : "Internal server error"})
  }
})






// todo  compeleted 

// delete user by id 

router.delete('/delete-user/:id' , async(req,res)=>{

  const {id} = req.params

  try {

    const deletedUser = await User.findOneAndDelete({_id : id})

    // if(!deletedUser || deletedUser.length ===0){
    //   return res.status(401).json({message : 'User nor found'})
    // }

    // if (deleteResult.deletedCount > 0) {
    //   console.log(`${deleteResult.deletedCount} reports deleted successfully.`);
    // } else {
    //   console.log('No reports found for the given user ID.');
    // }

  

    // console.log('deleted user ' , deletedUser)

    // user related all bookings should be deleted 

    const deleteduserbooking = await Booking.find({email : deletedUser.email})

    await Booking.deleteMany({email : deletedUser.email})

    // console.log('deleted user bookings all ' ,deleteduserbooking)

    // await Booking.find({email : deletedUser.email})



    // console.log('deleted booking of all ' , deleteduserbooking)

    // user related all room.currentbookings should be deleted 


    const temp = deleteduserbooking; 

    const roomIds = temp.map((item)=> item.roomid)

    // console.log('all roomIds' , roomIds)

    const room = await Room.find({_id : {$in : roomIds }})

    // console.log('all room value to be deleted ' , room)


    const bookingIds = temp.map((item)=> item._id)

    // console.log('all booking ids ' , bookingIds )

    /*

    MongoDB ke native drivers aur Mongoose dono mein, deleteMany sirf poore documents ko delete kar sakta hai. Agar tumhe documents ke specific subdocuments ko delete karna hai (jaise currentbookings array ke andar se specific bookingId ko), toh tumhe updateMany aur $pull operator ka use karna padega, jaise maine pehle bataya.


    */

    const roomcurrent = await Room.updateMany(
      
      {"currentbookings.bookingId" : {$in : bookingIds}} , 

      {
        $pull : {
          currentbookings : {
            bookingId : { $in : bookingIds}
          }
        }
      }
    
    
    )


        
   

    // console.log('curren tof bookings ' , roomcurrent)



    // const room = await Room.findById({_id : deleteduserbooking.roomid})

    // const temp = room.currentbookings

    // const store = temp.filter((item)=> item.bookingId.toString() !== deleteduserbooking._id.toString())

    // room.currentbookings = store; 

    // await room.save(); 



    // user related all report and cancelreq should be deleted


    const reported = await Report.deleteMany({user : deletedUser._id}).populate('user')

    // console.log('length of reported .................' , reported.length)
    // console.log('reported items ' ,reported)


    // user related  cancelreq should be deleted

    const requested = await Request.deleteMany({user : deletedUser._id}).populate('user')


    // console.log('length of requested .................' , requested.length)

    // console.log('requested found' , requested)


    // if(deletedUser && deletedUser.length>0){
    //   console.log('deleted user find')
    // }else{
    //   console.log('no user found')
    // }

    // if(deleteduserbooking && deleteduserbooking.length>0){
    //   console.log('deleted booking find')
    // }else{
    //   console.log('no booking found')
    // }

    // if(roomcurrent && roomcurrent.length>0){
    //   console.log('deleted room found')
    // }else{
    //   console.log('no room found')
    // }

    // if(reported && reported.length>0){
    //   console.log('reported item found')
    // }else{
    //   console.log('no reported item found')
    // }
    // if(requested && requested.length>0){
    //   console.log('requested item found')
    // }else{
    //   console.log('no requested item found')
    // }

    // const deletedbookingCancel = await Request.findOneAndDelete({bookingid : deleteduserbooking._id})

    // console.log('deleted booking cancel req' , deletedbookingCancel)

    // const deletedReport = await Report.findOneandDelete({booking : deleteduserbooking._id})
    // console.log('deleted report ' , deletedReport)


    res.status(201).json({message : 'User deleted successfully ' , deletedUser})
    
  } catch (error) {
    console.log(error); 
    res.status(500).json({message : "Internal server error"})
  }

  
})


// get by email 

router.get('/get-user-email/:email' , async (req,res)=>{

  try {
    const {email} = req.params 
    // console.log('email  form useadmin' , email); 
   
    const result = await User.findOne({email })
    res.send(result); 
  } catch (error) {
    console.log(error); 
    res.status(500).json({message : 'Internal server error'})
  }
})


module.exports = router