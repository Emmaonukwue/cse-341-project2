const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection('developers').find();
    result.toArray().then((developers) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(developers);
    })
}

const getSingle = async (req, res) => {
    const developerId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('developers').find({_id: developerId});
    result.toArray().then((developers) => {
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(developers);
    })
}

const createDeveloper = async (req, res) => {

}

const updateDeveloper = async (req, res) => {

}

const deleteDeveloper = async (req, res) => {

}

module.exports = {
    getAll,
    getSingle,
    createDeveloper,
    updateDeveloper,
    deleteDeveloper
}