let name = 'messageController'
const schema = require('../schema/messageSchema')
const userSchema = require('./controller')


function convertToWAT(isoString) {
    const date = new Date(isoString);
    const options = { timeZone: 'Africa/Lagos', hour12: false };
    const watDateTime = date.toLocaleString('en-GB', options);
    return watDateTime;
}

const isoString = '2024-10-06T11:09:31.324Z';
//console.log(convertToWAT(isoString));

async function sendMessage(email ,message){
    
    try {
            console.log('this is message');
        
        const checkForImage =await userSchema.findEmail(email)
        if(!checkForImage){
            console.log(`we are here`);
            
            console.log(`the email ${email} doesn't exist in the database`);
            return{
                error: true,
                message:`the email ${email} does not exist in the database`
            }
            
        }
        let mail = checkForImage.message.email
        const currentDate = new Date()
    
        const createMessage= {
            email:mail,
            messages:[{
                date:currentDate,
                message: message
            }]
        }
        const send = await schema.create(createMessage)
        console.log('Message saved successfully:', send);
        return { error: false, message: 'Message sent successfully' };

    } catch (error) {
        console.log(`error occurred on send message  messageController`);
           console.error('Error sending message:', error.message);
        return{
            error:true,
            message: error.message
        }
        
    }
}

async function getAll(){
    try {
        const getAll = await schema.find()
        if(!getAll){
            console.log(`error occurred getting all the users`);
            console.log(getAll);
            return{
                error: true,
                message: `error occurred getting all the users`
            }
            
        }
        console.log(`these are all the users: ${getAll}`);
        return{
            error:false,
            message: getAll
        }
    } catch (error) {
        console.log(`error occurred at message Controller getAll`);
        console.log(error.message);
        return{
            error:true,
            message: error.message
        }
    }
}

module.exports={
    sendMessage,getAll
}