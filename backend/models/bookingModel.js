const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    room: { type: String, required: true },
    email : {type : String , required : true },
    roomid: { type: String, required: true },
    userid: { type: String, required: true },
    fromdate: { type: String, required: true },
    todate: { type: String, required: true },
    totalDays: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    paymentStatus: { type: String,required: true },
    status: { type: String, required: true, default: 'pending' },
    checkCancelDate : {type : Boolean , default : false , require: true},
    cancellationDeadline : {type : String}
  

  },
  {
    timestamps: true,
  }
);

const bookingModel = mongoose.model('Booking', bookingSchema);

module.exports = bookingModel;
