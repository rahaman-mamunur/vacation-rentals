const mongoose = require('mongoose')
const express = require('express')


const reportSchema = mongoose.Schema({

    booking : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Booking'
    },

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},
{
    timestamps : true , 
}

)





// model 

const reportModel = mongoose.model('Report' , reportSchema)

module.exports = reportModel ; 