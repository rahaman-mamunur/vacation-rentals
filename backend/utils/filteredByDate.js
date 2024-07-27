const moment = require('moment')

const currentTime = moment(); 
console.log(currentTime.format('DD-MM-YYYY'))



const bookings = {

    bstartdate : '24-05-2024',
    benddate: '25-05-2024'

}

const userdate = ['2024-05-24', '2024-05-24']; 

const userstartdate = moment(userdate[0] ,'YYYY-MM-DD' )
const userenddate = moment(userdate[1] , 'YYYY-MM-DD' )
const bstartdate = moment(bookings.bstartdate  , 'DD-MM-YYYY' )
const benddate = moment(bookings.benddate , 'DD-MM-YYYY' )

console.log( 'user start date ' , userstartdate.format('DD-MM-YYYY')); 
console.log('user end date' , userenddate.format('DD-MM-YYYY')); 
console.log('b start date ' , bstartdate.format('DD-MM-YYYY')); 
console.log('b end date ' ,benddate.format('DD-MM-YYYY')); 



var availability = true; 

console.log('inside 0')


console.log(userstartdate.isBetween(bstartdate,benddate , null , []))


if(userstartdate.isBetween(bstartdate , benddate , null , []) && userenddate.isBetween(bstartdate , benddate , null , [])){

    console.log('inside 1')

    if(userstartdate.isSame(bstartdate) || userenddate.isSame(benddate) || userstartdate.isSame(benddate) || userenddate.isSame(bstartdate)){

    console.log('inside 2')


        if(

            (userstartdate.isSameOrAfter(bstartdate) && userstartdate.isSameOrBefore(benddate) ) ||
        
        (userenddate.isSameOrAfter(bstartdate) && userenddate.isSameOrBefore(benddate))
        ){
    console.log('inside 3')


            availability = false; 
        }
    
    
    }
}

console.log('checker : ', availability); 