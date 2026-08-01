const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const { User, Student, Faculty, Admin } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Check if account is active
    if (user.status !== 'active') {
      return sendError(res, 'Account is deactivated. Contact administrator.', 403);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Generate JWT
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    // Get role-specific profile
    let profile = null;
    if (user.role === 'Student') {
      profile = await Student.findOne({
        where: { user_id: user.id },
        include: [{ association: 'department', attributes: ['department_name'] }]
      });
    } else if (user.role === 'Faculty') {
      profile = await Faculty.findOne({
        where: { user_id: user.id },
        include: [{ association: 'department', attributes: ['department_name'] }]
      });
    } else if (user.role === 'Admin') {
      profile = await Admin.findOne({ where: { user_id: user.id } });
    }

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    sendSuccess(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      },
      profile
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    let profile = null;
    if (user.role === 'Student') {
      profile = await Student.findOne({
        where: { user_id: user.id },
        include: [{ association: 'department', attributes: ['department_name'] }]
      });
    } else if (user.role === 'Faculty') {
      profile = await Faculty.findOne({
        where: { user_id: user.id },
        include: [{ association: 'department', attributes: ['department_name'] }]
      });
    } else if (user.role === 'Admin') {
      profile = await Admin.findOne({ where: { user_id: user.id } });
    }

    sendSuccess(res, { user, profile });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  res.clearCookie('token');
  sendSuccess(res, null, 'Logged out successfully');
};

module.exports = { login, getMe, logout };
