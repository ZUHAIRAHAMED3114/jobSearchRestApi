const Job = require('../Models/JobsModel');
const ErrorHandler = require('../utility/ErrorHandler');
const AsyncErrorHandler = require('../MIddleWares/catchingAsyncError');

const CrudOperation = {
    getJobs: AsyncErrorHandler(async(req, res, next) => {
        const jobs = await Job.find();
        res.status(200)
            .json({
                success: true,
                jobs: jobs
            })

    }),
    getSingleJob: async(req, res, next) => {

    },
    createJob: AsyncErrorHandler(async(req, res, next) => {
        // before creating a job we have to add the user to the job object to make relationship consistent
        // so directly we add the user to the body
        // this req.user.id will be added by the authentication header
        req.body.user = req.user.id;
        const job = await Job.create(req.body)
        res.status(201)
            .json({
                success: true,
                message: 'Job is Created',
                data: job
            })

    }),
    updateJob: AsyncErrorHandler(async(req, res, next) => {

        let currentjob = await Job.findById(req.user.id);
        if (!currentjob) {
            return next(new ErrorHandler('Job not Found', 404))
        }

        let updatedResult = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: true
        });

        return res.status(200)
            .json({
                success: true,
                message: 'job is updated successfully',
                data: updatedResult

            });
    }),
    deleteJob: AsyncErrorHandler(async(req, res, next) => {
        let current = await Job.findById(req.params.id);
        if (!current) {
            return next(new ErrorHandler('Resource Not Found', 404));
        }
        // finally deleting the object as follows
        let deletedJob = Job.findByIdAndDelete(req.params.id);
        return res.status(204)
            .json({
                success: true

            })

    })

}

module.exports = CrudOperation;