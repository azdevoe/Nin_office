let Schema = require("../admin/adminSchema");
let bcrypt = require('bcrypt');
const allData = require('../controller/controller');

async function creteUser(name, password, Nins, roles) {
  let ggg = await bcrypt.hash(password, 10);
  console.log('Input values:', { name, ggg, Nins });

  const user = await allData.findNin(Nins);
  console.log('User object:', user);

  if (user.error) {
    console.log('User not found');
    return {
      error: true,
      message: `This user ${Nins} doesn't exist in the database`
    };
  }

  const Nin = user.data ? user.data.Nin : undefined;
  console.log('Nin:', Nin);

  if (!Nin) {
    console.log('who the heck are you');
    return {
      error: true,
      message: `This user ${Nins} doesn't exist in the database`
    };
  }

  try {
    let rr = await Schema.create({
      name: name,
      password: ggg,
      Nin: Nin,
      roles: roles,
    });
    console.log('User successfully created:', rr);

    return {
      error: false,
      data: rr
    };
  } catch (error) {
    console.error('Error occurred at create user in controller:', error);
    return {
      error: true,
      message: error.message
    };
  }
}

async function getAll(){
    try {
            const uu =await Schema.find({},{_id:0,__v:0})
            //console.log(uu);
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
    console.log(`Nin value: ${Nin} (type: ${typeof Nin}) instead of number`);

    const user = await schema.findOne({ Nin:parseInt(Nin) }, { _id: 0, __v: 0 });

    if (!user) {
      console.log(`User not found: ${Nin}`);
      return { error: true, data: `The user does not exist` };
    } else {
      console.log(user);
      return { error: false, data: user };
    }
  } catch (error) {
    console.log(`Error occurred at findOne: ${error.message}`);
    return { error: true, message: error.message };
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
         const find =await Schema.findOne({Nin:Nin})
          if(!find){
              console.log(`user ${Nin} not found`);
              return{
                error: true,
                message: `user ${Nin} not found`
              }
              
          }else{
            const verify =await bcrypt.compare(password, find.password)
            console.log(verify);
            if (!verify) {
                console.log(`invalid password`);
                
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
          console.log(`errror occured at verify user`);

        return{
          
          error: true,
          message: error.message
        }
      }
}

module.exports = {
    creteUser,getAll,findOne,findNin,updateUser,verifyUser
}