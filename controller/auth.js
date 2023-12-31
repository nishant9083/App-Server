const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacherModel");

exports.signUp = async (req, res) => {
    try {    
        let { name, email, password, enrollment} = req.body;        
     
        const existingUser = await User.findOne({ email: email });        
        if (existingUser)
            return res
                .status(400)
                .json({ msg: "Email already exists!" });        

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: passwordHash,
            enrolledFor:enrollment,            
        });
        const savedUser = await newUser.save();        
        req.session.userId = savedUser._id; // Save the user's ID in the session
        res.json({
            'name': savedUser.name,
            'email': savedUser.email,  
            'enrollment': savedUser.enrolledFor,
            'purchasedSeries':savedUser.purchasedSeries,
            profession: savedUser.profession,          
        });
    } catch (err) {
        console.log("error happened", err);
        res.status(500).json({ error: err.message });
    }
};

exports.logIn = async (req, res) => {
    try {
        let { email, password } = req.body;
        
        const existingUser = await User.findOne({ email: email });
        if (!existingUser)
            return res
                .status(400)
                .json({ msg: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
        // Set the expiration time (in seconds from the current time)
        const expirationTimeInSeconds = 1800; // 30 min
        const expirationTime = Math.floor(Date.now() / 1000) + expirationTimeInSeconds;
        req.session.userId = existingUser._id; // Save the user's ID in the session
        console.log(req.session.userId);
        const token = jwt.sign({ id: existingUser._id, exp: expirationTime }, process.env.JWT_SECRET);
        res.setHeader("Access-Control-Expose-Headers", "*");
        // res.cookie('token', token, { path: '/', domain: 'localhost', httpOnly: true, maxAge: 1800000 });
        res.header('Authorization', `Bearer ${token}`);
        return res.json({
            existingUser,            
        });
    } catch (err) {
        console.log('there is error in catch block');
        res.status(500).json({ error: err.message });
    }
};


exports.teacherSignUp = async (req, res) => {
    try {    
        let { name, email, password} = req.body;        
     
        const existingTeacher = await Teacher.findOne({ email: email });        
        if (existingTeacher)
            return res
                .status(400)
                .json({ msg: "Email already exists!" });        

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new Teacher({
            name,
            email,
            password: passwordHash,                        
        });
        const savedUser = await newUser.save();  
        req.session.userId = savedUser._id; // Save the user's ID in the session                      
        res.json({
            'name': savedUser.name,
            'email': savedUser.email,
            'profession': savedUser.profession,
        });
    } catch (err) {
        console.log("error happened", err);
        res.status(500).json({ error: err.message });
    }
};

exports.teacherLogIn = async (req, res) => {
    try {
        let { email, password } = req.body;
        
        const existingTeacher = await Teacher.findOne({ email: email });
        if (!existingTeacher)
            return res
                .status(400)
                .json({ msg: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, existingTeacher.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });        
        req.session.userId = existingTeacher._id; // Save the user's ID in the session        
        return res.json({
          'name': existingTeacher.name,
          'email': existingTeacher.email,
          'profession': existingTeacher.profession,              
        });
    } catch (err) {
        console.log('there is error in catch block');
        res.status(500).json({ error: err.message });
    }
}

exports.logOut = (req, res) => {    
    res.clearCookie('authToken');
    res.status(200).json({ message: "User logged out." });
};
