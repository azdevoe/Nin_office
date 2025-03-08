const schema = require("../schema/schema");
let Schema = require("../schema/schema")
let bcrypt = require('bcrypt')
let color = require('colors')

function genRand(){
    const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; 
  const day = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const millisecond = now.getMilliseconds();

  

  // Combine the date and time parts into a single number
  const dateNumber = `${year}${month}${day}${hour}${minute}${second}${millisecond}`;

  return parseInt(dateNumber);

}


async function creteUser(name,password,Nin,email,hobbies){

    let ggg =await bcrypt.hash(password, 10)
    console.log('Input values:');
    console.log({ name, ggg, Nin,email, hobbies });

    try {
        let rr = await Schema.create({
        name: name,
        password: ggg,
        Nin: Nin,
        email:email,
        hobbies: hobbies
         })
          console.log(`user successfully created`);
          console.log(rr);
          
        return{
            error: false,
            data:rr
        }
    } catch (error) {
        console.error(`error occurred at create user in controller`, error)
        return{
          error:true,
          message: error.message
        }
    }

    
   
   
}


async function getAll(){
    try {
            const uu =await Schema.find({},{_id:0,__v:0})
            console.log(uu);
            return{
                error: false,
                message: uu
            }
            
    } catch (error) {
        return{
            error: true,
            return: error.message
        }
    }
}

async function findOne(name){
  try {
    const user = await schema.aggregate([
  { $match: { name: 'firstName' } }, // Find documents with name 'firstName'
  { $project: { _id: 0, __v: 0 } } // Exclude _id and __v fields
])

    // const user = await schema.find({name: name}, {_id:0,__v:0});
    if (!user) {
      console.log(`User not found: ${name}`);
      return { error: true, data: `The user does not exist` };
    } else {
      console.log(user);
      return { error: false, data: user };
    }
  } catch (error) {
    console.log(`Error occurred at findOne`);
    return { error: true, message: error.message };
  }
}

async function findNin(Nin) {
  try {
    console.log(`i am entering the findNin function in the controller`);
    
    console.log(`Nin value: ${Nin} (type: ${typeof Nin})`);

    const user = await schema.findOne({ Nin:parseInt(Nin) }, { _id: 0, __v: 0 });

    if (!user) {
      console.log(`User not found: ${Nin} at findNin`);
      return { error: true, data: `The user does not exist` };
    } else {
      
      console.log(color.bgYellow(`this is the user${user}`));
      return { error: false, data: user };
    }
  } catch (error) {
    console.log(`Error occurred at findOne: ${error.message}`);
    return { error: true, message: error.message };
  }
}

async function findEmail(email){
    const search =await schema.findOne({email},{ _id: 0, __v: 0 ,password:0,hobbies:0})
    

   try {
      if(!search||search==null||search==undefined){
        console.log(`user not found`);
        return{
          error: true,message:`User not found`
        }

        
      }
        console.log(`user found`);
        console.log(search);
        
        return{
          error: false,
          message: search
        }
        
    
   } catch (error) {
    console.log(`error occured at controller/findemail`);
      return{
        error:true,
        message: error.message
      }
   }
}

async function updateUser(Nin,name) {
   try {
       const hh =await schema.find({Nin: Nin});

    if(hh){
        const nameUpdate =await schema.updateOne(
          { Nin: Nin},
          {$set: {name: name}},
      )
      console.log(nameUpdate);
      return{
        error: false,
        data: nameUpdate
      }
      
    }else{
        console.log("the NiN number"+ Nin+ "doesn't exist")
        return{
          error: true,
          message: `the NiN number ${Nin} doesn't exist`
        }
    }
   } catch (error) {
      console.log(`error occurred at controller updateUser`);
      return{
        error: true,
        message: error.message
      }
      
   }
}


async function verifyUser(Nin, password){
      try {
         const find =await schema.findOne({Nin:Nin})
          if(!find){
              console.log(`user ${Nin} not found`);
              console.log(`+++++__________________----------==============`);

              return{
                error: true,
                message: `user ${Nin} not found`
              }
              
          }else{
            const verify =await bcrypt.compare(password, find.password)
            console.log(verify);
            if (!verify) {
              return{
                error:true,
                message: `invalid password`
              }
            } else {
                console.log(`verify: ${verify}`);
                console.log(find);
                
                
                return{
              error: false,
              data: `${find.password}`
              }
            }
            
            
          }
      } catch (error) {
          console.log(`error occurred at verify user`);

        return{
          
          error: true,
          message: error.message
        }
      }
}

async function changePassword(Nin, password) {
  try {
    const user = await schema.findOne({ Nin: Nin });
    if (!user) {
      console.log(`User with Nin ${Nin} doesn't exist`);
      return { error: true, message: `User with Nin ${Nin} doesn't exist` };
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await schema.findOneAndUpdate(
        { Nin: Nin },
        { $set: { password: hashedPassword } },
        { new: true }
      );
      console.log(`Password changed for user with Nin ${Nin}`);
      return { error: false, data: updatedUser };
    }
  } catch (error) {
    return { error: true, message: error.message };
  }
}





module.exports = {
    creteUser,genRand,getAll,findOne,updateUser,verifyUser,changePassword,findNin,findEmail
}




// async function verifyUser(Nin, password){
//   try {
//     console.log(`Verifying user with Nin: ${Nin}`);
//     const find = await schema.findOne({Nin:Nin});
//     console.log(`Find result: ${find}`);
//     if(!find){
//       console.log(`User ${Nin} not found`);
//       return { error: true, message: `User ${Nin} not found` };
//     } else {
//       console.log(`User found, verifying password`);
//       const verify = await bcrypt.compare(password, find.password);
//       console.log(`Password verification result: ${verify}`);
//       if (!verify) {
//         return { error: true, message: `Invalid password` };
//       } else {
//         console.log(`Password verified`);
//         return { error: false, data: find }; // Return the entire user object
//       }
//     }
//   } catch (error) {
//     console.log(`Error occurred at verify user: ${error}`);
//     return { error: true, message: error.message };
//   }
// }



// async function changePassword(Nin,password) {
//   try {
//       const user =await schema.findOne({Nin:Nin})
//       if(!user){
//         console.log(`this user ${user.Nin} doesnt exist`);
//         return{
//           error: true,
//           message: `this user ${user.Nin} doesnt exist`
//         }
        
        
//       }else{
//         const newPassword = schema.updateOne(
//           {Nin: Nin},
//           {$set: {password:password}}
//         )
//         console.log(`the password has been changed `);
        
//         return{
//           error: false,
//           data: newPassword,
//         }

        
//       }

//   } catch (error) {
//       return{
//         error:true,
//         message: error.message
//       }
//   }
// }
