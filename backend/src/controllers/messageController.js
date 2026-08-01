const { Message, User } = require('../models');
const { sendSuccess, sendCreated } = require('../utils/response');
const { Op } = require('sequelize');

const getMyMessages = async (req, res, next) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ sender_id: req.user.id }, { receiver_id: req.user.id }]
      },
      include: [
        { association: 'sender', attributes: ['id', 'username', 'email', 'role'] },
        { association: 'receiver', attributes: ['id', 'username', 'email', 'role'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    sendSuccess(res, messages);
  } catch (error) { next(error); }
};

const sendMessage = async (req, res, next) => {
  try {
    const { receiver_id, subject, content } = req.body;
    const msg = await Message.create({
      sender_id: req.user.id,
      receiver_id,
      subject,
      content
    });
    sendCreated(res, msg, 'Message sent successfully');
  } catch (error) { next(error); }
};

module.exports = { getMyMessages, sendMessage };
