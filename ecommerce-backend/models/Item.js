const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: { type: String, default: 'item' },
    brand: { type: String },
    image: {
      type: String,
      default:
        'https://cdn3d.iconscout.com/3d/premium/thumb/empty-box-no-items-here-3d-icon-download-in-png-blend-fbx-gltf-file-formats--inventory-management-states-vol-4-pack-design-development-icons-9792330.png'
    },
    thumbnail: { type: String },
    condition: { type: String } // e.g., new, used
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
