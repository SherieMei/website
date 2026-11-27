const Garden = require("../models/Garden");

exports.getGarden = async (req, res) => {
  try {
    let garden = await Garden.findOne();
    if (!garden) {
      garden = await Garden.create({
        name: "Creative soul",
        ideas: [],
        tasks: []
      });
    }

    res.json({
      success: true,
      data: garden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    const garden = await Garden.findOneAndUpdate(
      {},
      { name: name.trim() },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      data: garden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addIdea = async (req, res) => {
  try {
    const { title, content, mood } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Idea title is required"
      });
    }

    const garden = await Garden.findOneAndUpdate(
      {},
      {
        $push: {
          ideas: {
            title: title.trim(),
            content: content || "",
            mood: mood || "Calm"
          }
        }
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      data: garden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task is required"
      });
    }

    const garden = await Garden.findOneAndUpdate(
      {},
      {
        $push: {
          tasks: {
            text: text.trim(),
            completed: false
          }
        }
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      data: garden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { title, content, mood } = req.body;

    const garden = await Garden.findOne();

    if (!garden) {
      return res.status(404).json({
        success: false,
        message: "Garden not found"
      });
    }

    const idea = garden.ideas.id(ideaId);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found"
      });
    }

    if (title !== undefined) idea.title = title.trim();
    if (content !== undefined) idea.content = content;
    if (mood !== undefined) idea.mood = mood;

    await garden.save();

    res.json({
      success: true,
      data: garden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const garden = await Garden.findOne();

    if (!garden) {
      return res.status(404).json({
        success: false,
        message: "Garden not found"
      });
    }

    const idea = garden.ideas.id(ideaId);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found"
      });
    }

    idea.deleteOne();
    await garden.save();

    res.json({
      success: true,
      message: "Idea deleted successfully",
      data: garden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;

    const garden = await Garden.findOne();

    if (!garden) {
      return res.status(404).json({
        success: false,
        message: "Garden not found"
      });
    }

    const task = garden.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    task.completed = completed;

    await garden.save();

    res.json({
      success: true,
      data: garden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const garden = await Garden.findOne();

    if (!garden) {
      return res.status(404).json({
        success: false,
        message: "Garden not found"
      });
    }

    const task = garden.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    task.deleteOne();
    await garden.save();

    res.json({
      success: true,
      message: "Task deleted successfully",
      data: garden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};