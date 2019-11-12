const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  previewText: {
    type: String,
    required: false
  },

  // Cogito fields
  postType: {
    // project/prj, service/srv, message/msg, idea, blog
    // task/tsk/job, skill/skl, coins/rbc/atp
    type: String,
    required: false
  },
  interestTags: {
    type: String,
    required: false
  },
  sheets: {
    type: String,
    required: false
  },
  // Cogito fields

  imageUrl: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);