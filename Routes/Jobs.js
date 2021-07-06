const routers = require('express').Router();
const { authorizeRoles, authenticationMiddleware } = require('../MIddleWares/authentication');

// importing the JobsController Method ..
const { getJobs, getSingleJob, updateJob, deleteJob, createJob } = require('../Controllers/JobsController');
routers.route('/jobs').get(getJobs)
routers.route('/job/new').post(authenticationMiddleware, authorizeRoles('employee', 'user'), createJob);
routers.route('/jobs/:id').put(updateJob);
routers.route('/jobs/:id').delete(deleteJob);



module.exports = routers;