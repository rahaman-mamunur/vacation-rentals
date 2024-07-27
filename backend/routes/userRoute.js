const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const capitalizeName = require('../utils/capitalizeName');
const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
const Request = require('../models/bookingCancelModel');
const Report = require('../models/reportModel');

// post registration

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, cpassword } = req.body;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res
        .status(409)
        .json({
          message:
            'Email already exists. Please use a different email address.',
        });
    }

    if (password !== cpassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const newUser = new User({
      name: capitalizeName(name),
      email,
      password,
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

router.post('/google-register', async (req, res) => {
  const { name, email } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      const newGoogleUser = new User({
        name: capitalizeName(name),
        email,
      });

      await newGoogleUser.save();
    }

    res.status(201).send(existingUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.find({ email, password });

    if (user.length > 0) {
      const currentUser = {
        name: user[0].name,
        email: user[0].email,
        isAdmin: user[0].isAdmin,
        _id: user[0]._id,
      };
      res.send(currentUser);
    } else {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server error' });
  }
});

// get all users

router.get('/getallusers', async (req, res) => {
  try {
    const result = await User.find();

    if (!result || result.length === 0) {
      return res.status(400).json({ message: 'No Users found' });
    }

    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error /getallusers');
  }
});

// update admin access status

router.patch('/admin-status/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await User.findOneAndUpdate(
      { _id: id },

      {
        $set: {
          isAdmin: true,
        },
      },
      {
        new: true,
      }
    );

    if (!result || result.length === 0) {
      return res.status(401).json({ message: 'No users found !!! ' });
    }

    res.status(201).json({ message: 'Admin Status Updated', result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// todo  compeleted

// delete user by id

router.delete('/delete-user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findOneAndDelete({ _id: id });

    const deleteduserbooking = await Booking.find({ email: deletedUser.email });

    await Booking.deleteMany({ email: deletedUser.email });

    const temp = deleteduserbooking;

    const roomIds = temp.map((item) => item.roomid);

    const room = await Room.find({ _id: { $in: roomIds } });

    const bookingIds = temp.map((item) => item._id);

    const roomcurrent = await Room.updateMany(
      { 'currentbookings.bookingId': { $in: bookingIds } },

      {
        $pull: {
          currentbookings: {
            bookingId: { $in: bookingIds },
          },
        },
      }
    );

    const reported = await Report.deleteMany({
      user: deletedUser._id,
    }).populate('user');

    const requested = await Request.deleteMany({
      user: deletedUser._id,
    }).populate('user');

    res
      .status(201)
      .json({ message: 'User deleted successfully ', deletedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// get by email

router.get('/get-user-email/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const result = await User.findOne({ email });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
