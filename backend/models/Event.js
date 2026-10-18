const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter event name'],
    },
    description: {
      type: String,
      required: [true, 'Please enter event description'],
    },
    discount: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    featuredProductId: {
      type: String,
    },
    product: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
