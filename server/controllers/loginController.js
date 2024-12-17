const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");
const sequelize = require('../db');
const sendEmail = require('../mail');
const encrypt = require('../helper').encrypt;
const decrypt = require('../helper').decrypt;

function generateToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_KEY);
}

const bulkRegister = async (req, res) => {
    const users = req.body; 
    let transaction;
    var response;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { 
            response = {
                status: 400,
                type: 'error',
                msg: 'Validation errors occurred.',
                errors: errors
            }
            return response;
        }

        // Start a transaction
        transaction = await sequelize.transaction();

        // Iterate through each user in the request body
        for (const userData of users) {
            const { emailR, firstName, lastName, role, password, repassword } = userData;

            if (password !== repassword) { 
                response = {
                    status: 400,
                    type: 'error',
                    msg: `Passwords do not match for email: ${emailR}`
                }
            }

            // Check if the user already exists
            const existingUser = await User.findOne({
                where: { email: emailR },
                transaction,
            });

            if (existingUser) {
                response = {
                    status: 400,
                    type: 'error',
                    msg: `User already exists with email: ${emailR}`
                }
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create the user
            await User.create(
                {
                    firstName,
                    lastName,
                    email: emailR,
                    role,
                    password: hashedPassword,
                },
                { transaction }
            );
        }

        // Commit the transaction if all users are successfully created
        await transaction.commit();

        response = {
            status: 200,
            type: 'success',
            msg: "All users registered successfully."
        } 
    } catch (error) { 
        if (transaction) await transaction.rollback();
        response = {
            status: 500,
            type: 'error',
            msg: error.message || "Server error occurred during registration.",
            errors: error.errors
        };
    }

    return res.json(response);
}

const registerView = async (req, res) => {
    const { emailR, firstName, lastName, role, password, repassword} = req.body;
    var response;
    let email = emailR;
    let createdBy = req.body.createdBy ? req.body.createdBy : null;

    if(password !== repassword){
        response = {
            status: 400,
            type: 'error',
            msg: 'Oops! Passwords don\'t match. Please re-enter.'
        }
    } else {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [
                        { email: email }
                    ]
                }
            });
    
            if (existingUser) {
                response = {
                    status: 204,
                    type: 'info',
                    msg: 'User already exists!'
                };
            } else {
                // Hash the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
    
                // Create the new user
                const newUser = await User.create({
                    firstName,
                    lastName,
                    email,
                    role,
                    password: hashedPassword,
                    createdBy: createdBy || null
                });
    
                response = {
                    status: 200,
                    type: 'success',
                    msg: "Registration complete! Get ready to dive into our platform."
                };
            }
        } catch (error) {
            response = {
                status: 500,
                type: 'error',
                msg: error.message || 'Server error! Please try again.'
            };
        }
    } 

    return res.json(response);
}
// For View 
const loginView = async (req, res) => {
    let response;
    const { email, password } = req.body;

    try {
        // Find user by email using Sequelize
        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            response = {
                status: 401,
                type: 'warning',
                msg: 'Invalid email or password'
            };
        } else {
            // Compare the provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                response = {
                    status: 401,
                    type: 'warning',
                    msg: 'Invalid email or password.'
                };
            } else {
                // Generate JWT token for the user
                const token = await generateToken(user);

                if (token) {
                    // Update user token in the database
                    user.token = token;
                    const savedUser = await user.save(); 

                    if (savedUser.email) {
                        const verifytoken = await verifyToken(token);

                        if (verifytoken) {
                            if (user.verified == '1') {
                                user.loggedin = '1';
                                await user.save();

                                response = {
                                    status: 200,
                                    type: 'success',
                                    title: 'Welcome',
                                    msg: 'Always explore more',
                                    token: token
                                };
                            } else {
                                user.token = null;
                                await user.save();

                                response = {
                                    status: 500,
                                    type: 'warning',
                                    msg: 'User not verified'
                                };
                            }
                        } else {
                            user.token = null;
                            await user.save();

                            response = {
                                status: 500,
                                type: 'error',
                                msg: 'Something went wrong'
                            };
                        }
                    } else {
                        response = {
                            status: 500,
                            type: 'error',
                            msg: 'Something went wrong'
                        };
                    }
                } else {
                    response = {
                        status: 500,
                        type: 'error',
                        msg: 'Something went wrong'
                    };
                }
            }
        }

    } catch (error) {
        response = {
            status: 401,
            type: 'warning',
            msg: error.message || 'Invalid email or password'
        };
    }

    return res.json(response);
};

const getNonAdminUsers = async (req, res) => {
    let response;

    try {
        const search = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit === 'all' ? 0 : parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const whereConditions = {
            role: { [Op.ne]: 'ADMIN' }, 
            deletedAt: null,
        };
        
        if (search) {
            whereConditions[Op.or] = [
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
            ];
        }
        
        const users = await User.findAndCountAll({
            where: whereConditions,
            attributes: ['firstName', 'lastName', 'email', 'token'],
            limit: limit,
            offset: offset,
        });  

        if (users.rows.length > 0) {
            response = {
                status: 200,
                type: 'success',
                data: users.rows,
                pageTotal: Math.ceil(users.count / limit),
                totalRecords: users.count,
            };
        } else {
            response = {
                status: 404,
                type: 'error',
                msg: 'No non-admin users found',
            };
        }
    } catch (error) {
        response = {
            status: 500,
            type: 'error',
            msg: error.message || 'Failed to fetch non-admin users',
        };
    }

    return res.json(response);
};


const logOut = async (req, res) => {
    let response;
    const { token } = req.body;

    try{
        const user = await User.findOne({token: token});
        if (!user) {
            response = {
                status: 401,
                type: 'warning',
                msg: 'User not exists'
            }
        } else {
            user.token = null;
            user.loggedin = 0;
            await user.save();

            response = {
                status: 200,
                type: 'success',
                title: 'Logged Out',
                msg: 'See you soon',
                logout: 1
            }
        }
    }
    catch(error){
        response = {
            status: 500,
            type: 'error',
            msg: 'Something went wrong'
        }
    }

    return res.json(response);
}

const checkLoggedIn = async (req, res) => {
    let response;
    const { token } = req.body;

    try{
        const user = await User.findOne({
            $and: [{token: token}, { loggedin : '1' }]
        });

        let verifyToken = verifyToken(token);
        if (!user) {
            response = {
                status: 403,
                type: 'warning',
                msg: 'Unauthorized',
                logout: 1
            }
        } 
        else if(user.loggedin == '1'){
            response = {
                status: 200,
                type: 'success',
                msg: '',
                loggedin: 1
            }
        }
        else {
            response = {
                status: 500,
                type: 'error',
                msg: 'Maybe user not available'
            }
        }
    } 
    catch(error){
        response = {
            status: 500,
            type: 'error',
            msg: 'Something went wrong'
        }
    }

    return res.json(response);
}

const deleteUser = async (req, res) => {
    let response;
    
    try {
        const deletedRows = await User.destroy({
            where: {
                email: req.body.email, 
                deletedAt: null 
            }
        });
        
        if (deletedRows > 0) {
            response = {
                status: 200,
                type: 'success',
                msg: "User deleted."
            };
        } else {
            response = {
                status: 404,
                type: 'error',
                msg: "User not found or already deleted."
            };
        }
    } catch (error) {
        response = {
            status: 500,
            type: 'error',
            msg: error.message || 'Internal Server Error'
        };
    }

    return res.json(response);
};

const resetPasswordRequest = async (req, res) => {
    let response;
    const { token, domain } = req.body;
    
    try{
        const user = await User.findOne({
            $and: [{token: token}, { loggedin : '1' }]
        });
        if(!user){
            response = {
                status: 401,
                type: 'warning',
                msg: 'User not exists'
            }
        } else { 
            const link = domain+'/reset-callback/'+encrypt(user.email);
            const message = `<a href='${link}' target="_blank" rel="noopener noreferrer">Click here to reset</a>`; 
            const send = await sendEmail('', user.email, 'Reset Password', message, 'test'); 
            if(!send){
                response = {
                    status: 500,
                    type: 'error',
                    msg: send.msg || 'Failed to send email'
                };
            } else {
                if(send.status == 200){
                    response = {
                        status: send.status,
                        type: send.type,
                        msg: 'Mail sent'
                    };
                } else {
                    response = {
                        status: send.status,
                        type: send.type,
                        msg: send.msg?.reason || send.msg
                    };
                }
                
            } console.log('working==>', send);
        }
    } catch (error){
        response = {
            status: 500,
            type: 'error',
            msg: error.message || 'Internal Server Error'
        };
    }

    return res.json(response);
}

const updateResetStatus = async (req, res) => {
    let response;
    const { email } = req.body;

    let emaildecrypted = decrypt(email);
    
    try{
        const user = await User.findOne({
            $and: [{email: emaildecrypted}, { loggedin : '1' }]
        });

        if(!user){
            response = {
                status: 401,
                type: 'warning',
                msg: 'User not exists'
            }
        } else {
            user.resetPassword = 1;
            saveUser = await user.save();
            if(saveUser){
                response = {
                    status: 200,
                    type: 'success',
                    msg: 'you may reset your password'
                }
            } else {
                response = {
                    status: 500,
                    type: 'error',
                    msg: 'status not updated'
                }
            }
        }
    } catch(error){
        response = {
            status: 500,
            type: 'error',
            msg: error.message || 'Internal Server Error'
        };
    }

    return res.json(response);
}

const updatePassword = async (req, res) => {
    let response;
    const { password, repassword, email } = req.body;

    try{
        const user = await User.findOne({
            $and: [{email: email}, { loggedin : '1' }, {resetPassword : 1}]
        });

        if(!user){
            response = {
                status: 401,
                type: 'warning',
                msg: 'Reset request invalid'
            }
        } else {
            const salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(user.password, salt);
            
            try {
                const isMatch = await bcrypt.compare(password, hashedPassword);
                
                if (isMatch) {
                    response = {
                        status: 401,
                        type: 'warning',
                        msg: 'New password must be different from the old password',
                    };
                } else {
                    hashedPassword = await bcrypt.hash(password, salt);
                    user.resetPassword = null;
                    user.password = hashedPassword;
                    const saveUser = await user.save();
            
                    if (saveUser) {
                        response = {
                            status: 200,
                            type: 'success',
                            msg: 'Password reset successful',
                        };
                    } else {
                        response = {
                            status: 500,
                            type: 'error',
                            msg: 'Status not updated',
                        };
                    }
                }
            } catch (err) {
                response = {
                    status: 500,
                    type: 'error',
                    msg: err.message || 'Something went wrong',
                };
            }
            
            return res.json(response);
            
        }
    } catch(error){
        response = {
            status: 500,
            type: 'error',
            msg: error.message || 'Internal Server Error'
        };
    }

    return res.json(response);
}


module.exports =  {
    bulkRegister,
    registerView,
    loginView,
    getNonAdminUsers,
    logOut,
    deleteUser,
    checkLoggedIn,
    resetPasswordRequest,
    updateResetStatus,
    updatePassword
};