// controllers/scheduleController.js
import Schedule from "../models/scheduleModel.js";
import Field from "../models/FieldModel.js";

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      include: [Field],
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id, {
      include: [Field],
    });
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const { field_id, day, open_time, close_time } = req.body;
    const newSchedule = await Schedule.create({ field_id, day, open_time, close_time });
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    const { field_id, day, open_time, close_time } = req.body;
    await schedule.update({ field_id, day, open_time, close_time });
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    await schedule.destroy();
    res.json({ message: "Schedule deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
