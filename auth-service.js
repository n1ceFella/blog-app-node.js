const bcrypt = require('bcryptjs');
var mongoose = require("mongoose");
const { user } = require("pg/lib/defaults");
var Schema = mongoose.Schema;
var userSchema = new Schema({
  "userName":  {
    "type": String,
    "unique": true
  },
  "password": String,
  "email": String,
  "loginHistory": [{dateTime: Date, userAgent: String}]
});
let User; // to be defined on new connection (see initialize)

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection("mongodb+srv://unix90:Vova1990@vlog.zrvet9x.mongodb.net/vlog?retryWrites=true&w=majority");

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();

        });
    });
}

module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        if(userData.password != userData.password2){
            reject("Passwords do not match");
        }else {
            bcrypt.hash(userData.password, 10).then(hash=>{ // Hash the password using a Salt that was generated using 10 rounds
                userData.password = hash;
                let newUser = new User(userData);
                
                newUser.save((err) => {
                    if(err){                    
                        if(err.code == 11000){
                        reject("User Name already taken");
                        } else
                        reject("There was an error creating the user: " + err );
                    }
                    else{
                        resolve();
                    }
                });
            }).catch(err=>{
                console.log("There was an error encrypting the password: " + err); // Show any errors that occurred during the process
            });
        }
    });
}

module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.find({userName: userData.userName}).exec()
        .then((users) => {
            if(users.length == 0){
                reject("Unable to find user:" + users[0]);
            }
            else{
            bcrypt.compare(userData.password, users[0].password).then((result) => {
                if(result){
                    users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent}); //check this
                    User.updateOne(
                        { userName: users[0].userName},
                        { $set: { loginHistory: users[0].loginHistory } }
                      ).exec().then(() => {
                    console.log(users[0]);
                    resolve(users[0])}); 
                }else{
                    reject("Incorrect Password for user: " + userData.userName);
                }
            }).catch((err) =>{
                reject("There was an error verifying the user: " + err);
            })
        }

        }).catch((err) => {
            reject(reject("There was an error verifying the user: " + userData.userName));
        });
    });
}