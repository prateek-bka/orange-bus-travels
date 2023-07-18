const authMiddleware = require("../middlewares/authMiddleware");
const busModel = require("../models/busModel");

const router = require("express").Router();

// add-bus

router.post("/add-bus", async (req, res) => {
  try {
    const existingBus = await busModel.findOne({
      busNumber: req.body.busNumber,
    });
    if (existingBus) {
      return res
        .status(200)
        .send({ success: false, message: "Bus already exists" });
    }

    const newBus = new busModel(req.body);
    await newBus.save();
    return res.status(200).send({
      success: true,
      message: "Bus added successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// get-all-buses

router.post("/get-all-buses", authMiddleware, async (req, res) => {
  try {
    const buses = await busModel.find();
    return res.status(200).send({
      success: true,
      message: "Buses fetched successfully",
      data: buses,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// update-bus

router.post("/update-bus", authMiddleware, async (req, res) => {
  try {
    await busModel.findByIdAndUpdate(req.body._id, req.body);
    return res.status(200).send({
      success: true,
      message: "Bus updated successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// delete-bus

router.post("/delete-bus", authMiddleware, async (req, res) => {
  try {
    await busModel.findByIdAndDelete(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Bus deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.post("/get-bus-by-id", authMiddleware, async (req, res) => {
  try {
    const bus = await busModel.findById(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Bus fetched successfully",
      data: bus,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
