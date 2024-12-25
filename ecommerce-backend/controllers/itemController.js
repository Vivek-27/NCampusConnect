const Item = require('../models/Item');

// Create Item
const createItem = async (req, res) => {
  const { title, description, price, condition, category, image } = req.body;

  try {
    const newItem = new Item({
      title,
      description,
      price,
      category,
      condition,
      image,
      seller: req.user._id
    });

    await newItem.save();
    res.status(201).json({ newItem, message: 'Item created Successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};

const getItems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Price filtering with min and max validation
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};

      if (req.query.minPrice) {
        const minPrice = parseFloat(req.query.minPrice);
        if (!isNaN(minPrice)) {
          filter.price.$gte = minPrice; // Greater than or equal to minPrice
        }
      }

      if (req.query.maxPrice) {
        const maxPrice = parseFloat(req.query.maxPrice);
        if (!isNaN(maxPrice)) {
          filter.price.$lte = maxPrice; // Less than or equal to maxPrice
        }
      }
    }

    // Filter by seller if provided
    if (req.query.seller) {
      filter.seller = req.query.seller;
    }

    // Search by title or description if provided
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } }, // Case insensitive search
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by condition if provided (new, used, etc.)
    if (req.query.condition) {
      filter.condition = req.query.condition;
    }

    // Pagination handling: Default to page 1, limit 10 if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find items matching the filter, with pagination
    const items = await Item.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('seller', '_id name username profileImg');

    // Return the filtered items as a response
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// app.get('/api/products',

const getSearch = async (req, res) => {
  const searchQuery = req.query.name || '';

  try {
    // Search in both name and description fields
    const products = await Item.find({
      $or: [
        { name: new RegExp(searchQuery, 'i') }, // Case-insensitive search for name
        { description: new RegExp(searchQuery, 'i') } // Case-insensitive search for description
      ]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
};

// Get one Item
const getOneItem = async (req, res) => {
  try {
    const items = await Item.find({ _id: req.params.id }).populate(
      'seller',
      '_id name username profileImg '
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user._id }).populate(
      'seller',
      'username'
    );
    res.json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error2' });
  }
};

const getUserItems = async (req, res) => {
  const { id } = req.params;
  try {
    const items = await Item.find({ seller: id }).populate(
      'seller',
      'username'
    );
    console.log(items);
    res.json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error2' });
  }
};

const updateItem = async (req, res) => {
  const { title, description, price, condition } = req.body;
  const itemId = req.params.id; // Get item ID from the request parameters

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { title, description, price, condition },
      { new: true, runValidators: true } // Returns the updated document and runs validators
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(updatedItem); // Send the updated item back to the client
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteItem = async (req, res) => {
  const itemId = req.params.id; // Get item ID from the request parameters
  try {
    const deletedItem = await Item.findByIdAndDelete(itemId); // Delete the item

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' }); // Confirm deletion
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getOneItem,
  createItem,
  getItems,
  updateItem,
  deleteItem,
  getMyItems,
  getUserItems,
  getSearch
};
