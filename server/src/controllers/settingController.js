const prisma = require('../config/db');

// @desc    Get all site settings as a key-value object (Public)
// @route   GET /api/settings
const getSettings = async (req, res, next) => {
  try {
    const settingsList = await prisma.siteSetting.findMany();
    const settings = {};

    settingsList.forEach((s) => {
      settings[s.key] = s.value;
    });

    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update site settings (Admin)
// @route   PUT /api/settings
const updateSettings = async (req, res, next) => {
  try {
    const settings = req.body; // Key-value map

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const promises = Object.keys(settings).map((key) => {
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(settings[key]) },
        create: { key, value: String(settings[key]) },
      });
    });

    await Promise.all(promises);

    res.json({ message: 'Site settings updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
