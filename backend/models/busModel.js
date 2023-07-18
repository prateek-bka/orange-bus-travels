const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: true,
  },
  busNumber: {
    type: String,
    required: true,
  },
  busCapacity: {
    type: Number,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  busDepartureDate: {
    type: Date,
    required: true,
  },
  busDepartureTime: {
    type: String,
    required: true,
  },
  busArrivalDate: {
    type: Date,
    required: true,
  },
  busArrivalTime: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  seatsBooked: {
    type: Array,
    default: [],
  },
  status: {
    type: String,
    default: "Yet To Start",
  },
});

module.exports = mongoose.model("buses", busSchema);
