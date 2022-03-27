/*
*
-> title: sample handler
-> description : A sample handler for testing purpose
-> Author : Sagar 
-> Date : 27-3-22 
*
*/

// module scaffolding

const handler={}


handler.sampleHandler=( requestProperties, callBack)=>{

    callBack(200,{
        massage:'this is a sample url'
    })

    console.log('this is sample handler')
}

module.exports= handler