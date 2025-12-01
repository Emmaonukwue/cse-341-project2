const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
      //#swagger.tags=['Locations']
      const result = await mongodb.getDatabase().db().collection('locations').find();
    result.toArray().then((locations) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(locations);
    })
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    //#swagger.tags=['Locations']
    const locationId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('locations').find({_id: locationId});
    result.toArray().then((locations) => {
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(locations);
    })
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createLocation = async (req, res) => {
  try {
    //#swagger.tags=['Locations']
    const { city, state, country, flag, photo, continent, dialCode, currency, language } = req.body;

    // Validation for location city, state and country
    if (!city || !state || !country) {
      return res.status(400).json({ message: 'city, state and country are required.' });
    }

    if (flag || photo) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

      // Extract extension from the file name
      const lowerName = flag.toLowerCase();
      const isValidExt = allowedExtensions.some(ext => lowerName.endsWith(ext));

      if (!isValidExt) {
        return res.status(400).json({
          message: `Invalid file type for ${flag}. Only JPG, PNG, GIF, WEBP files are allowed.`,
        });
      }
    }

    // Validate dialCode only if provided (must be numeric and max 3 digits)
    if (dialCode !== undefined) {
      // Check if it contains only digits
      const isNumeric = /^\d+$/.test(dialCode);

      if (!isNumeric) {
        return res.status(400).json({
          message: 'dialCode must contain only numbers.',
        });
      }

      // Check length not more than 3 digits
      if (String(dialCode).length > 3) {
        return res.status(400).json({
          message: 'dialCode must not be more than 3 digits.',
        });
      }
    }

    const location = {
      city,
      state,
      country,
      flag,
      photo,
      continent,
      dialCode,
      currency,
      language
    };
    // Insert location
    const response = await mongodb.getDatabase().db().collection('locations').insertOne(location);
    
    if (response.acknowledged) {
      res.status(201).json({ message: 'Location created successfully', location });
      } else {
        res.status(500).json(response.error || 'Some error occurred while creating the location.');
      }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const updateLocation = async (req, res) => {
  try {
    //#swagger.tags=['Locations']
    const locationId = new ObjectId(req.params.id);
    const { city, state, country, flag, photo, continent, dialCode, currency, language } = req.body;

    const updateData = {};

    // Validate and assign city
    if (city !== undefined) {
      if (!city) {
        return res.status(400).json({ message: 'city cannot be empty.' });
      }
      updateData.city = city;
    }

    // Validate and assign state
    if (state !== undefined) {
      if (!state) {
        return res.status(400).json({ message: 'state cannot be empty.' });
      }
      updateData.state = state;
    }

    // Validate and assign country
    if (country !== undefined) {
      if (!country) {
        return res.status(400).json({ message: 'country cannot be empty.' });
      }
      updateData.country = country;
    }

    // Validate flag or photo only if provided
    if (flag !== undefined) {
      if (flag) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const lowerName = flag.toLowerCase();
        const isValidExt = allowedExtensions.some(ext => lowerName.endsWith(ext));

        if (!isValidExt) {
          return res.status(400).json({
            message: `Invalid file type for ${flag}. Only JPG, PNG, GIF, WEBP files are allowed.`,
          });
        }
      }
      updateData.flag = flag;
    }

    if (photo !== undefined) {
      if (photo) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const lowerName = photo.toLowerCase();
        const isValidExt = allowedExtensions.some(ext => lowerName.endsWith(ext));

        if (!isValidExt) {
          return res.status(400).json({
            message: `Invalid file type for ${photo}. Only JPG, PNG, GIF, WEBP files are allowed.`,
          });
        }
      }
      updateData.photo = photo;
    }

    // Validate dialCode only if provided
    if (dialCode !== undefined) {
      const isNumeric = /^\d+$/.test(dialCode);

      if (!isNumeric) {
        return res.status(400).json({
          message: 'dialCode must contain only numbers.',
        });
      }

      if (String(dialCode).length > 3) {
        return res.status(400).json({
          message: 'dialCode must not be more than 3 digits.',
        });
      }

      updateData.dialCode = dialCode;
    }

    // Add other fields to the array
    if (continent !== undefined) updateData.continent = continent;
    if (currency !== undefined) updateData.currency = currency;
    if (language !== undefined) updateData.language = language;

    // Prevent empty updates
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided to update.' });
    }

    // Update in database
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('locations')
      .updateOne({ _id: locationId }, { $set: updateData });

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Location not found.' });
    }
    res.status(200).json({
      message: 'Location updated successfully',
      updatedFields: updateData
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



const deleteLocation = async (req, res) => {
  try {
    //#swagger.tags=['Locations']
    const locationId = new ObjectId(req.params.id);
        
    const response = await mongodb.getDatabase().db().collection('locations').deleteOne({ _id: locationId});
    if (response.deletedCount > 0) {
        res.status(204).send();
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
    getAll,
    getSingle,
    createLocation,
    updateLocation,
    deleteLocation
}