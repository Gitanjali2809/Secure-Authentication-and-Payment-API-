const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Generate JWT Token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
}
//       REGISTER
// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //  Hash the password (The "Scrambler")
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user in MongoDB
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: "User registered successfully!"
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//          LOGIN
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req,res)=>{
    const {email, password}=req.body;

    // find user by email
    const user=await User.findOne({email});

    // check if user exists AND password matches
    // (bcrypt.compare checks the plain password against the hashed one)
    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id), //this is the ID CARD
        });
    }  else{
        res.status(401).json({message: 'Invalid email or password'});
    }

};

//@desc Get user profile
//@route GET/api/auth/profile
const getUserProfile=async(req,res)=>{
    //req.user was set by the middleware
    res.json(req.user);
}

module.exports = { registerUser, loginUser, getUserProfile };