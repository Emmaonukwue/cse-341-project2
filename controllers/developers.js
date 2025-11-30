const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
      //#swagger.tags=['Developers']
      const result = await mongodb.getDatabase().db().collection('developers').find();
      result.toArray().then((developers) => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(developers);
      })
    } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
    try {
      //#swagger.tags=['Developers']
      const developerId = new ObjectId(req.params.id);
      const result = await mongodb.getDatabase().db().collection('developers').find({_id: developerId});
      result.toArray().then((developers) => {
          res.setHeader('Content-Type', 'application/json')
          res.status(200).json(developers);
      })  
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

const createDeveloper = async (req, res) => {
  try {
    //#swagger.tags=['Developers']
    const { id, name, email, photos, projects } = req.body;

    // Validation for developer id, name, and email
    if (!id || !name || !email) {
      return res.status(400).json({ message: 'id, name, and email are required.' });
    }

    // Validation for photos array to be an array of photos with id and name
    if (photos && !Array.isArray(photos)) {
      return res.status(400).json({ message: 'photos must be an array.' });
    }
    if (photos) {
      for (const photo of photos) {
        if (!photo.id || !photo.name) {
          return res.status(400).json({ message: 'Each photo must have id and name.' });
        }
      }
    }

    // Validate projects array
    if (projects && !Array.isArray(projects)) {
      return res.status(400).json({ message: 'projects must be an array.' });
    }
    if (projects) {
      for (const project of projects) {
        if (!project.id || !project.name || !project.url) {
          return res.status(400).json({ message: 'Each project must have id, name, and url.' });
        }
        if (project.photos && !Array.isArray(project.photos)) {
          return res.status(400).json({ message: 'Project photos must be an array.' });
        }
        if (project.photos) {
          for (const photo of project.photos) {
            if (!photo.id || !photo.name) {
              return res.status(400).json({ message: 'Each project photo must have id and name.' });
            }
          }
        }
      }
    }

    const developer = {
      id,
      name,
      email,
      photos: photos || [],
      projects: projects || []
    };

    // Insert developer
    const response = await mongodb.getDatabase().db().collection('developers').insertOne(developer);

    if (response.acknowledged) {
      res.status(201).json({ message: 'Developer created successfully', developer });
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the developer.');
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const updateDeveloper = async (req, res) => {
  try {
    //#swagger.tags=['Developers']
    const developerId = new ObjectId(req.params.id);
    const { id, name, email, photos, projects } = req.body;
    const updateData = {};

    // Validate only if field is provided
    if (id !== undefined) {
      if (!id) return res.status(400).json({ message: 'id cannot be empty.' });
      updateData.id = id;
    }

    if (name !== undefined) {
      if (!name) return res.status(400).json({ message: 'name cannot be empty.' });
      updateData.name = name;
    }

    if (email !== undefined) {
      if (!email) return res.status(400).json({ message: 'email cannot be empty.' });
      updateData.email = email;
    }

    if (photos !== undefined) {
      if (!Array.isArray(photos)) {
        return res.status(400).json({ message: 'photos must be an array.' });
      }

      for (const photo of photos) {
        if (!photo.id || !photo.name) {
          return res.status(400).json({ message: 'Each photo must have id and name.' });
        }
      }

      updateData.photos = photos;
    }

    if (projects !== undefined) {
      if (!Array.isArray(projects)) {
        return res.status(400).json({ message: 'projects must be an array.' });
      }

      for (const project of projects) {
        if (!project.id || !project.name || !project.url) {
          return res.status(400).json({ message: 'Each project must have id, name, and url.' });
        }

        if (project.photos !== undefined) {
          if (!Array.isArray(project.photos)) {
            return res.status(400).json({ message: 'Project photos must be an array.' });
          }

          for (const photo of project.photos) {
            if (!photo.id || !photo.name) {
              return res.status(400).json({ message: 'Each project photo must have id and name.' });
            }
          }
        }
      }

      updateData.projects = projects;
    }

    // Prevent empty updates
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    // update
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('developers')
      .updateOne({ _id: developerId }, { $set: updateData });

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    res.status(200).json({
      message: 'Developer updated successfully',
      updatedFields: updateData
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteDeveloper = async (req, res) => {
  try {
    //#swagger.tags=['Developers']
    const developerId = new ObjectId(req.params.id);
    
    const response = await mongodb.getDatabase().db().collection('developers').deleteOne({ _id: developerId});
    if (response.deletedCount > 0) {
        res.status(204).send();
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
    getAll,
    getSingle,
    createDeveloper,
    updateDeveloper,
    deleteDeveloper
}