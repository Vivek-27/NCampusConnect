const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token expired or invalid' });
      }

      const user = await User.findById(decoded.id);
      if (!user.isVerified)
        return res.status(401).json({
          message:
            'Please verify your email first using the link sent to your email adress.'
        });
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = auth;
