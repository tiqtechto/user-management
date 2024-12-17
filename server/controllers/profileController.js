const User = require("../models/User");
const imageType = require('../helper').getImageTypeFromBase64;
const sharp = require('sharp');
const sendMail = require('../mail');
const { Op } = require("sequelize");

const profilePic = async (req, res) => {
    let response;
    const {imageBase64, token} = req.body;
    const extension = imageType(imageBase64);
    const user = await User.findOne({
        $and: [{token: token}, { loggedin : '1' }]
    });

    if(!user){
        response = {
            status: 500,
            type: 'error',
            msg: 'User not found'
        }
    } else {
        try {
            // Decode base64 string into a buffer
            const splitImg = imageBase64.split(',')
            const buffer = Buffer.from(splitImg[1], 'base64');
            
            // Process the image (example: rotate and crop)
            const processedImageBuffer = await sharp(buffer)
              .resize(500, 500)
              .toBuffer()
              .then(async (data) => {
                const base64Data = await data.toString('base64');
                user.image = splitImg[0]+','+ base64Data;
                
                const savedImage = await user.save();

                if(savedImage){
                    response = {
                        status: 200,
                        type: 'success',
                        msg: 'Image saved'
                    }
                } else {
                    response = {
                        status: 500,
                        type: 'error',
                        msg: 'Something went wrong'
                    }
                }
              }).catch(async (error) => {
                response = {
                    status: 500,
                    type: 'error',
                    msg: error.message || 'Something went wrong'
                }
              });
            
          } catch (error) {
            response = {
                status: 500,
                type: 'error',
                msg: error.message || 'Something went wrong'
            }
          }
    }
    
    return res.json(response);
}

const getProfileData = async (req, res) => {
    const { token } = req.body;

    let response;
    try {
        let whereConditions = {};
        if(req.body?.email){
            whereConditions[Op.and] = {
                email: { [Op.eq]: req.body.email }
            };
        } else {
            whereConditions[Op.and] = {
                token: { [Op.eq]: token }
            };
        }
        
        const user = await User.findOne({
            where: whereConditions,
            attributes: {
                exclude: ['id', 'loggedin', 'token', 'updatedAt', 'password']
            }
        }); 
        
        if (user) {
            response = {
                status: 200,
                type: 'success',
                data: user,
                msg: 'profile data'
            };
        } else {
            response = {
                status: 404,
                type: 'error',
                msg: 'User not found or not logged in'
            };
        } 
    } catch (error) {
        response = {
            status: 500,
            type: 'error',
            msg: error.message || 'Something went wrong'
        };
    }

    return res.json(response);
};


const profileUpdate = async (req, res) =>{
    let response;
    const {token, firstName, lastName, email } = req.body;
    try{
        const user = await User.findOne({
            $and: [{token: token}, { loggedin : '1' }]
        });

        if(!user){
            response = {
                status: 404,
                type: 'info',
                msg: 'User not found'
            }
        } else {
            user.firstName = firstName;
            user.lastName = lastName;
            
            if(user.email.toLowerCase() !== email.toLowerCase()){
                user.email = email;
                user.verified = 0;
            }
            saveUser = await user.save();

            if(saveUser){
                if(user.verified == 0){
                    response = {
                        status: 200,
                        type: 'success',
                        msg: 'User updated please verify you email address'
                    }
                } else{
                    response = {
                        status: 200,
                        type: 'success',
                        msg: 'User updated'
                    }
                }
            } else {
                response = {
                    status: 500,
                    type: 'error',
                    msg: 'Something went wrong'
                }
            }
        }
    } catch(error){
        response = {
            status: 500,
            type: 'error',
            msg: error.message || 'Something went wrong'
        }
    }
    
    return res.json(response);
}

const testMail = async (req, res) => {
    let response;
    const {token, emailfrom, emailto, subject, body, type} = req.body;

    try{
        const sendmail = await sendMail(emailfrom,emailto, subject, body, type);
        console.log('send status->',sendmail.status);
        if(typeof sendmail.status != undefined && sendmail.status == 200){
            response = {
                status: 200,
                type: 'success',
                msg: 'Mail sent'
            }
        } else {
            response = {
                status: 500,
                type: 'error',
                msg: sendmail.msg.response || 'Something went wrong'
            }
        }
    } catch(error){
        response = {
            status: 500,
            type: 'error',
            msg: error.message || 'Something went wrong'
        }
    }

    return res.json(response);
}

module.exports = {
    profilePic,
    profileUpdate,
    getProfileData,
    testMail
};

