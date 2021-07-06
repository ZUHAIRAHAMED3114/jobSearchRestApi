const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const slug = require('slugify');
const validator = require('validator');
const geocoder = require('../utility/Geocoder');

const jobSchema = new Schema({
    title: {
        type: String,
        required: [true, 'please entered job Title'],
        trim: true,
        maxlength: [100, 'job title can not Exceed 100 character']
    },
    slug: {
        type: String
    },
    description: {
        type: String,
        required: [true, 'Please enter job Descripton'],
        maxlength: [1000, 'jobs description cannot 1000 characters']
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'please add a valid Email address']

    },
    address: {
        type: String,
        required: [true, 'please add an address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dSphere'
        },
        formattedAddress: String,
        city: String,
        State: String,
        zipcode: String,
        country: String
    },
    company: {
        type: String,
        required: [true, 'Please add Company Name']
    },
    industry: {
        type: [String],
        required: true,
        enum: {
            values: [
                'Business',
                'Information Technology',
                'Banking',
                'Education/Training',
                'Telecommunicaiton',
                'Others'
            ],
            message: 'Please Select correct option for industry'
        }
    },
    jobType: {
        type: String,
        required: true,
        enum: {
            values: [
                'Permanent',
                'Temporary',
                'Internship'
            ],
            message: 'please select correct option for job type'
        }
    },
    minEducation: {
        type: String,
        required: true,
        enum: {
            values: ['Bachlors', 'Masters', 'Phd'],
            message: 'please select correct option for educations'
        }
    },
    position: {
        type: Number,
        default: 1
    },
    experiance: {
        type: String,
        // required: true,
        enum: {
            values: [
                'No Experiance',
                '1 Year -2 Years',
                '2 Years- 5 Years',
                '5 Years+'
            ],
            message: 'Please select correct options for Experiance'
        }

    },
    salary: {
        type: Number,
        required: [true, 'Please enter expected salary for this job']
    },
    postingDate: {
        type: Date,
        default: Date.now
    },
    lastDate: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 7)
    },
    applicantsApplied: {
        type: [Object],
        select: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }



});
/*// output :
[
  {
    latitude: 48.8698679,
    longitude: 2.3072976,
    country: 'France',
    countryCode: 'FR',
    city: 'Paris',
    zipcode: '75008',
    streetName: 'Champs-Élysées',
    streetNumber: '29',
    administrativeLevels: {
      level1long: 'Île-de-France',
      level1short: 'IDF',
      level2long: 'Paris',
      level2short: '75'
    },
    provider: 'google'
  }
]; */

// creating a job slug befor saving
jobSchema.pre('save', async function(next) {
    var currentModel = this;
    currentModel.slug = slug(currentModel.title + '- required/', { lower: true })
    const data = await geocoder.geocode(currentModel.address);
    currentModel.location.coordinates = [data[0].latitude, data[0].longitude];
    currentModel.location.type = 'point';
    currentModel.location.formattedAddress = data[0].formattedAddress;
    currentModel.location.city = data[0].city;
    currentModel.location.State = data[0].state;
    currentModel.location.zipcode = data[0].zipcode;
    currentModel.location.country = data[0].country;
    console.log(data[0]);

    next();
})

module.exports = model('job', jobSchema);