const mongoose = require('mongoose');
const express = require('express');

const bookingcancelSchema = mongoose.Schema(
  {
    bookingid: {
      type: String,
      required: true,
    },

    user : {
      type : mongoose.Schema.Types.ObjectId,
      ref :  'User'

    },
    // userId: {
    //   type: String,
    //   required: true,
    // },

    bookingInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
  },

  {
    timestamps: true,
  }
);

const bookingCancelModel = mongoose.model(
  'Bookingcancelreq',
  bookingcancelSchema
);

module.exports = bookingCancelModel;
