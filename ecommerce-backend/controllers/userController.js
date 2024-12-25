const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const transporter = require('../config/nodemailer.js');
const Notification = require('../models/Notification');
// Verify Email
const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Send Verification Email
const sendVerificationEmail = async (user) => {
  const token = crypto.randomBytes(32).toString('hex');
  // Save the token to the user model (you may want to create a separate field)
  user.verificationToken = token;
  await user.save();
  const verificationUrl = `http://localhost:5000/api/users/verify/${token}`;
  const mailOptions = {
    to: user.email,
    from: 'CampusConnect <no-reply@campusconnect.com>', // Use a proper email address
    subject: 'Email Verification for CampusConnect',
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 50px auto;
              background: white;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              padding: 20px;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 10px 0;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              padding: 20px;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              font-size: 16px;
              color: white !important;
              background-color: #4CAF50;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 12px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to CampusConnect!</h1>
            </div>
            <div class="content">
              <p>Thank you for signing up!</p>
              <p>To complete your registration, please verify your email address by clicking the button below:</p>
              <a href="${verificationUrl}" class="button" >Verify Email</a>
              <p>If you did not create an account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} CampusConnect. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Update registerUser to send verification email
const registerUser = async (req, res) => {
  const { username, email, password, name } = req.body;
  if (!username)
    return res.status(406).json({ message: 'Username is required' });
  if (!email) return res.status(406).json({ message: 'Email is required' });

  try {
    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return res
        .status(400)
        .json({ message: 'Username already exists please use another' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await sendVerificationEmail(existingUser);
      return res
        .status(400)
        .json({ message: 'User with this email already exists. Please Login' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [firstname, ...lastnameParts] = name.split(' '); // Split the name
    const lastname = lastnameParts.join(' '); // Join the remaining parts

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstname: firstname,
      lastname: lastname
    });

    const user = await newUser.save();

    await sendVerificationEmail(newUser); // Send verification email
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // Remove the password before sending the user object
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.verificationToken;
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    });
    res.json({
      user: userObject,
      message: 'User registered successfully. Please verify your email.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }]
    });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Remove the password before sending the user object
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.verificationToken;
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    }); // use secure ture in production
    res.json({
      user: userObject
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  const user = req.user;
  const {
    firstname,
    lastname,
    username,
    phone,
    about,
    country,
    city,
    profileImg,
    new_username,
    postalCode,
    private
  } = req.body;

  try {
    // Update user fields if provided
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (private) user.private = private;
    if (phone) user.phone = phone;
    if (about) user.about = about;
    if (country) user.country = country;
    if (city) user.city = city;
    if (profileImg) user.profileImg = profileImg;
    if (postalCode) user.postalCode = postalCode;
    if (new_username != undefined && username != new_username) {
      const existingUserName = await User.findOne({ new_username });
      if (existingUserName) {
        return res
          .status(400)
          .json({ message: 'Username already exists please use another' });
      } else {
        user.username = new_username;
      }
    }

    await user.save();
    const userObject = user.toObject();
    delete userObject.password;

    return res.status(200).json({
      user: userObject,
      message: 'User details updated successfully.'
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

const updatedUserDetails = async (req, res) => {
  try {
    const updatedUser = await User.findById(req.user._id);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

const followUser = async (req, res) => {
  const io = req.app.get('io');
  try {
    const { selectedUserId } = req.body;

    // Prevent following yourself
    if (req.user._id === selectedUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    // Find the user to follow
    const user = await User.findById(selectedUserId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user has a private profile, it's a follow request
    if (user.private) {
      // Check if already sent a follow request
      const alreadySentRequest =
        req.user.sentFollowRequests.includes(selectedUserId);
      if (alreadySentRequest) {
        return res
          .status(400)
          .json({ message: 'You have already sent a follow request' });
      }

      // Add to sender's sent follow requests and receiver's follow requests
      await User.findByIdAndUpdate(req.user._id, {
        $push: { sentFollowRequests: selectedUserId }
      });
      await User.findByIdAndUpdate(selectedUserId, {
        $push: { followRequests: req.user._id }
      });

      // Notification for follow request sent
      const senderNotification = new Notification({
        from: req.user._id,
        to: selectedUserId,
        message: `You sent a follow request to ${user.username}`,
        type: 'followed',
        profileImg: req.user.profileImg
      });
      const receiverNotification = new Notification({
        from: req.user._id,
        to: selectedUserId,
        message: `${req.user.username} has sent you a follow request`,
        type: 'request',
        profileImg: req.user.profileImg
      });

      await senderNotification.save();
      await receiverNotification.save();

      // Emit notifications
      io.to(selectedUserId.toString()).emit(
        'newNotification',
        receiverNotification
      );
      io.to(req.user._id.toString()).emit(
        'newNotification',
        senderNotification
      );
    } else {
      // If public profile, follow directly
      const alreadyFollowing = req.user.following.includes(selectedUserId);
      if (alreadyFollowing) {
        return res
          .status(400)
          .json({ message: 'You are already following this user' });
      }

      // Add to both users' following and followers lists
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: selectedUserId }
      });
      await User.findByIdAndUpdate(selectedUserId, {
        $push: { followers: req.user._id }
      });

      // Notification for new follow
      const senderNotification = new Notification({
        from: req.user._id,
        to: selectedUserId,
        message: `You are now following ${user.username}`,
        type: 'followed',
        profileImg: user.profileImg
      });
      const receiverNotification = new Notification({
        from: req.user._id,
        to: selectedUserId,
        message: `${req.user.username} is now following you`,
        type: 'followed',
        profileImg: req.user.profileImg
      });

      await senderNotification.save();
      await receiverNotification.save();

      // Emit notifications
      io.to(selectedUserId.toString()).emit(
        'newNotification',
        receiverNotification
      );
      io.to(req.user._id.toString()).emit(
        'newNotification',
        senderNotification
      );
    }

    const updatedUser = await User.findById(req.user._id);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error following user' });
  }
};

const withdrawFollowRequest = async (req, res) => {
  const io = req.app.get('io');
  try {
    const { selectedUserId } = req.body;

    // Prevent withdrawing follow request for yourself
    if (req.user._id === selectedUserId) {
      return res
        .status(400)
        .json({ message: 'You cannot withdraw a follow request to yourself' });
    }

    const user = await User.findById(selectedUserId);
    if (user.private) {
      // Check if follow request exists
      const alreadySentRequest =
        req.user.sentFollowRequests.includes(selectedUserId);
      if (alreadySentRequest) {
        // Remove follow request from both users
        await User.findByIdAndUpdate(req.user._id, {
          $pull: { sentFollowRequests: selectedUserId }
        });
        await User.findByIdAndUpdate(selectedUserId, {
          $pull: { followRequests: req.user._id }
        });

        const updatedUser = await User.findById(req.user._id);
        return res.status(200).json(updatedUser);
      }

      // Remove follow request from both users
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: selectedUserId }
      });
      await User.findByIdAndUpdate(selectedUserId, {
        $pull: { followers: req.user._id }
      });

      // Send notification about withdrawn request
      const receiverNotification = new Notification({
        from: req.user._id,
        to: selectedUserId,
        message: `${req.user.username} has withdrawn their follow request.`,
        type: 'follow_request_withdrawn',
        profileImg: req.user.profileImg
      });

      await receiverNotification.save();
      io.to(selectedUserId.toString()).emit(
        'newNotification',
        receiverNotification
      );
    } else {
      // If not a private account, unfollow directly
      const alreadyFollowing = req.user.following.includes(selectedUserId);
      if (!alreadyFollowing) {
        return res
          .status(400)
          .json({ message: 'You are not following this user' });
      }

      // Remove from both users' following and followers lists
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: selectedUserId }
      });
      await User.findByIdAndUpdate(selectedUserId, {
        $pull: { followers: req.user._id }
      });

      // Notification for unfollow
      const receiverNotification = new Notification({
        from: req.user._id,
        to: selectedUserId,
        message: `${req.user.username} has unfollowed you.`,
        type: 'unfollowed',
        profileImg: req.user.profileImg
      });
      const senderNotification = new Notification({
        from: req.user._id,
        to: selectedUserId,
        message: `You have unfollowed ${user.username}.`,
        type: 'unfollowed',
        profileImg: req.user.profileImg
      });

      await receiverNotification.save();
      await senderNotification.save();

      // Emit notifications
      io.to(selectedUserId.toString()).emit(
        'newNotification',
        receiverNotification
      );
      io.to(req.user._id.toString()).emit(
        'newNotification',
        senderNotification
      );
    }

    const updatedUser = await User.findById(req.user._id);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error withdrawing follow request' });
  }
};

const acceptFollowRequest = async (req, res) => {
  const io = req.app.get('io');
  try {
    const { selectedUserId } = req.body;

    // Prevent accepting a request from yourself
    if (req.user._id === selectedUserId) {
      return res
        .status(400)
        .json({ message: 'You cannot accept a request from yourself' });
    }
    const user = await User.findById(selectedUserId);

    // Accept the follow request
    if (user.private) {
      const alreadyFollowing = req.user.following.includes(selectedUserId);
      if (alreadyFollowing) {
        return res
          .status(400)
          .json({ message: 'You are already following this user' });
      }

      // Add to both users' followers and following lists, remove from requests
      await User.findByIdAndUpdate(req.user._id, {
        $push: { followers: selectedUserId },
        $pull: { followRequests: selectedUserId }
      });
      await User.findByIdAndUpdate(selectedUserId, {
        $push: { following: req.user._id },
        $pull: { sentFollowRequests: req.user._id }
      });

      // Create notifications
      const receiverNotification = new Notification({
        from: req.user._id,
        to: selectedUserId,
        message: `${req.user.username} accepted your follow request.`,
        type: 'follow_request_accepted',
        profileImg: req.user.profileImg
      });

      const senderNotification = new Notification({
        from: selectedUserId,
        to: req.user._id,
        message: `You accepted a follow request from ${user.username}.`,
        type: 'follow_request_accepted',
        profileImg: user.profileImg
      });

      await receiverNotification.save();
      await senderNotification.save();

      // Emit notifications
      io.to(selectedUserId.toString()).emit(
        'newNotification',
        receiverNotification
      );
      io.to(req.user._id.toString()).emit(
        'newNotification',
        senderNotification
      );
    }

    const updatedUser = await User.findById(req.user._id);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error accepting follow request' });
  }
};

const denyFollowRequest = async (req, res) => {
  const io = req.app.get('io');
  try {
    const { selectedUserId } = req.body;

    // Prevent denying a request from yourself
    if (req.user._id === selectedUserId) {
      return res
        .status(400)
        .json({ message: 'You cannot deny a request from yourself' });
    }

    const user = await User.findById(selectedUserId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Deny the follow request
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { followRequests: selectedUserId }
    });
    await User.findByIdAndUpdate(selectedUserId, {
      $pull: { sentFollowRequests: req.user._id }
    });

    // Notification about the denied request
    const senderNotification = new Notification({
      from: req.user._id,
      to: selectedUserId,
      message: `${req.user.username} denied your follow request.`,
      type: 'follow_request_denied',
      profileImg: req.user.profileImg
    });

    const receiverNotification = new Notification({
      from: req.user._id,
      to: selectedUserId,
      message: `You denied a follow request from ${user.username}.`,
      type: 'follow_request_denied',
      profileImg: user.profileImg
    });

    await senderNotification.save();
    await receiverNotification.save();

    // Emit notifications
    io.to(selectedUserId.toString()).emit(
      'newNotification',
      receiverNotification
    );
    io.to(req.user._id.toString()).emit('newNotification', senderNotification);

    return res.status(200).json({ message: 'Follow request denied' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error denying follow request' });
  }
};

const followRequests = async (req, res) => {
  try {
    const requested = await User.findById(req.user._id)
      .select('-password')
      .populate('followRequests', '_id name username profileImg');
    res.status(200).json(requested);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const Friends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('following', '_id name username profileImg')
      .populate('followers', '_id name username profileImg');

    const Friends = user.following;
    res.json(Friends);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const AllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      '_id name username profileImg following followers '
    );
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getSearchUsers = async (req, res) => {
  const searchQuery = req.query.name || '';

  try {
    // Search in both name and description fields
    const users = await User.find(
      { username: new RegExp(searchQuery, 'i') },
      '_id name username profileImg '
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
};

module.exports = {
  getSearchUsers,
  getUser,
  updateUser,
  registerUser,
  loginUser,
  verifyEmail,
  followUser,
  withdrawFollowRequest,
  followRequests,
  acceptFollowRequest,
  denyFollowRequest,
  Friends,
  AllUsers,
  updatedUserDetails
};
