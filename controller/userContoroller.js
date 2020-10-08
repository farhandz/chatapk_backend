const userModel = require('../model/User')
const bcrypt = require('bcryptjs')
const { sendEmail } = require('../helper/activemail')
const jwt = require('jsonwebtoken')
const multer = require('../helper/multer')
const salt = 10
module.exports = {
    viewuser: async (req,res) => {
        try {
            const getAll = await userModel.getall()
            res.send({
                data: getAll
            })
        } catch (error) {
            res.send({
                error: error.message
            })
        }
    },
    updateUser: (req,res) => {
        try {
            multer.uploadsingle(req,res, async (err)=> {
                try {
                    if(err) {
                        res.send({
                            error: err
                        })
                    } else {
                        const {id} = req.params
                        const {username, alamat, phone_number, country} = req.body
                        const finID = await userModel.getbyid(id);
                        const image = !req.file ? finID[0].image : req.file.filename;
                        const update = await userModel.update(username, alamat, phone_number, country, image, id)
                        res.send(update)
                    }
                } catch (error) {
                    res.send({
                        error: error
                    })
                    
                }
            })
        } catch (error) {
            
        }
    },
    selectuserid: async (req,res) => {
        try {
            const {id} = req.params
            // console.log(id)
            const dataid = await userModel.getbyid(id)
            res.send({
                message: "get id berhasil",
                data: dataid
            })
        } catch (error) {
            res.send({
                message: error.message
            })
        }
    },
    displayFriend: async (req,res) => {
        try {
            const { id_friend } = req.params
            const data = await userModel.displayfriend(id_friend)
            res.send(data)
        } catch (error) {
           res.send({
               message: error.message
           }) 
        }
    },
    register: async (req,res) => {
        try {
            const {username, email, password} = req.body
            const hashpassword = bcrypt.hashSync(password, salt)
            sendEmail(email)
            const register = await userModel.register(username, email, hashpassword)
            res.send(register)
        } catch (error) {
            res.send(error.message)   
        }
    },
    verification: async (req,res) => {
        try {
            const { token } = req.params;
            if (token) {
              jwt.verify(token, "123", async (err, decode) => {
                  if(err) {
                      res.send({
                          message: err
                      })
                  } else {
                      const decodemail = decode.email
                       await userModel.verification(decodemail)
                      res.send('email has been activeted')
                  }
              });
            }
        } catch (error) {
            res.send(error.message)
        }
    },
    addfriend : async (req,res) => {
        try {
            const { id } = req.params;
            const {id_friends} = req.body
            console.log(id, id_friends);
           const data = await userModel.addfriends(id, id_friends )
           res.send(data)
        } catch (error) {
            res.send(error.message)
            
        }
    },
    getEmailById: async (req,res) => {
        try {
            const {email} = req.body
            const databyid = await userModel.idemail(email)
            if(databyid.length === 0) {
                res.send({
                    data: databyid,
                    status: 'gagal'
                })
            } else {
                
                res.send({
                    data: databyid,
                    status: 'sukses'
                })
            }
        } catch (error) {
            res.send(error.message)
        }
    },
    login: async (req,res) => {
        try {
            const { email, password } = req.body;
            const findEmail = await userModel.login(email)
            if(findEmail.length === 0) {
                res.send({
                    message: "email not found"
                })
            } else {
               const refreshtoken = findEmail[0].RefreshToken
               const newtokenrefresh = jwt.sign({email: email},'222')
               if(!refreshtoken) {
                   await userModel.refreshToken(newtokenrefresh, email)
               }
               const username = findEmail[0].username
               const emails = findEmail[0].email
               const passwords = findEmail[0].password
               const id = findEmail[0].id
               const ismatch = bcrypt.compareSync(password, passwords)
               if(ismatch) {
                   jwt.sign({ email: emails }, "111", { expiresIn: 3600 }, (err, token) => {
                       if(err) {
                           res.send(err)
                       } else {
                           if(!refreshtoken) {
                               res.send({
                                 message: "berhasil login",
                                 tokenLogin: token,
                                 refreshtoken: newtokenrefresh,
                                 username: username,
                                 id: id
                               });
                           } else {
                               res.send({
                                 message: "berhasil login",
                                 tokenLogin: token,
                                 refreshtoken: refreshtoken,
                                 username: username,
                                 id: id
                               });
                           }
                       }
                   });
               } else {
                   res.send({
                       message: "password salah"
                   })
               }
            } 
        } catch (error) {
            res.send({
                message: error.message
            })
        }
    }
}