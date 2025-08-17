const Joi = require('joi');

//for validating listings
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        image : Joi.string().allow('',null),
        location : Joi.string().required(),
        country : Joi.string().required().min(0),
        price : Joi.number().allow("",null),

    }).required()
}); 

//for validating reviews
module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        comment : Joi.string().required(),
        rating : Joi.number().required().min(1).max(5),
    }).required()
})