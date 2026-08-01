const { Event } = require('../models');
const { sendSuccess, sendCreated } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const events = await Event.findAll({ order: [['event_date', 'ASC']] });
    sendSuccess(res, events);
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    sendCreated(res, event, 'University event scheduled');
  } catch (error) { next(error); }
};

module.exports = { getAll, create };
