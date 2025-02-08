const express = require("express");

const { restoreUser, requireAuth, setTokenCookie } = require("../../utils/auth");
const { Spot, SpotImage, Review, Booking, ReviewImage, User } = require("../../db/models");
const { EmptyResultError } = require("sequelize");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();

const bcrypt = require("bcryptjs");


router.get("/", async (req, res, next) => {
    try {
      const allSpots = await Spot.findAll();
      res.json(allSpots);
    } catch (e) {
      next(e);
    }
  });


  router.get("/current", async (req, res, next) => {
    try {
      if (!req.user.id) {
        const userError = new Error("User must be signed in");
        userError.status = 403;
        throw userError;
      }
      const oneSpot = await Spot.findAll({
        where: {
          ownerId: req.user.id,
        },
      });
      res.json(oneSpot);
    } catch (e) {
      next(e);
    }
  });

  router.get("/:spotId", async (req, res, next) => {
    let accumulator=0
    try {
        const oneSpotReviews = await Review.findAll({
            where: {
              spotId: req.params.spotId,
            },
          });
          oneSpotReviews.forEach((element)=>{
            accumulator+=Number(element.stars)
          })
        let avgReviewRating=accumulator/oneSpotReviews.length

      const oneSpot = await Spot.findOne({
        where: {
          id: req.params.spotId,
        },
        include:{
            model: SpotImage
        }
      });

      if (!oneSpot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }


      let numReviews=oneSpotReviews.length
      let spotData = oneSpot.toJSON();
      spotData.numReviews = numReviews;
        spotData.avgStarRating = avgReviewRating;
        let correctSpotData = {
            id: spotData.id,
            ownerId: spotData.ownerId,
            address: spotData.address,
            city: spotData.city,
            state: spotData.state,
            country: spotData.country,
            lat: spotData.lat,
            lng: spotData.lng,
            name: spotData.name,
            description: spotData.description,
            price: spotData.price,
            createdAt: spotData.createdAt,
            updatedAt: spotData.updatedAt,
            numReviews: numReviews,
            avgStarRating: avgReviewRating,
            SpotImages: spotData.SpotImages
        }

      res.json(correctSpotData);
    } catch (e) {
      next(e);
    }
  });

router.get("/:spotId/reviews", async (req, res, next) => {
    try {

      const oneSpotReviews = await Review.findAll({
        where: {
          spotId: req.params.spotId,
        },
        include:{
            model: ReviewImage
        }
      });
      if(oneSpotReviews.length===0){
        return res.status(404).json({ message: "Spot couldn't be found" });
      }
      res.json(oneSpotReviews);
    } catch (e) {
      next(e);
    }
  });

  router.get('/:spotId/bookings', async (req, res, next) => {
    const { spotId } = req.params;
    console.log(spotId)
    try {
      const allBookings = await Booking.findAll({
        where: {
          spotId: spotId,
        },
      });
  
      const allBookingsIfOwner = await Booking.findAll({
        where: {
          spotId: spotId,
          userId: req.user.id,
        },
        include: {
          model: User
        }
      });
      console.log(allBookingsIfOwner)
  
      if (allBookingsIfOwner.length===0) {
        const allBookingsDataNotOwner = allBookings.map((element) => {
          return {
            spotId: element.spotId,
            startDate: element.startDate,
            endDate: element.endDate,
          };
        });
        return res.status(200).json(allBookingsDataNotOwner);
      }
      console.log(allBookingsIfOwner)
      const allBookingDataIfOwner = allBookingsIfOwner.map((element)=>{
        return{
          User: {
            id: element.User.id,
            firstName: element.User.firstName,
            lastName: element.User.lastName
          },
          id: element.id,
          spotId: element.spotId,
          userId: element.userId,
          startDate: element.startDate,
          endDate: element.endDate,
          createdAt: element.createdAt,
          updatedAt: element.updatedAt
        }
      })

  
      return res.status(200).json(allBookingDataIfOwner);
    } catch (e) {
        console.log(e)
      next(e);
    }
  });
  

router.post(
    '/',
    async (req, res) => {
        try {

            const { address, city, state, country, lat, lng, name, description, price } = req.body;
            const ownerId = req.user.id


            const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });

            if(!spot){
                res.status(400).json({
                    "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
                    "errors": {
                      "address": "Street address is required",
                      "city": "City is required",
                      "state": "State is required",
                      "country": "Country is required",
                      "lat": "Latitude must be within -90 and 90",
                      "lng": "Longitude must be within -180 and 180",
                      "name": "Name must be less than 50 characters",
                      "description": "Description is required",
                      "price": "Price per day must be a positive number"
                    }
                  })
            }


            return res.status(201).json({
                id: spot.id,
                ownerId: ownerId,
                address: address,
                city: city,
                state: state,
                country: country,
                lat: lat,
                lng: lng,
                name: name,
                description: description,
                price: price,
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
            });
        } catch (e) {
            next(e);
        }
    }
);

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
    try {
        const { spotId } = req.params;
        const { url, preview } = req.body;

        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });

        }

        const newImage = await SpotImage.create({
            spotId,
            url,
            preview,
        });

        return res.status(200).json({
            id: newImage.id,
            url: newImage.url,
            preview: newImage.preview,
        });
    } catch (e) {
        next(e);
    }
});

const validateSpotId = (req, res, next) => {
    const { spotId } = req.params;
    if (!Number.isInteger(Number(spotId))) {
        return res.status(400).json({
            message: "Validation error",
            errors: { id: "spotId must be a valid integer" },
        });
    }
    next();
};

const validateSpot = [
    check("address").notEmpty().withMessage("Address is required"),
    check("city").notEmpty().withMessage("City is required"),
    check("state").notEmpty().withMessage("State is required"),
    check("country").notEmpty().withMessage("Country is required"),
    check("lat")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be between -90 and 90"),
    check("lng")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be between -180 and 180"),
    check("name")
        .isLength({ max: 50 })
        .withMessage("Name must be 50 characters or less"),
    check("description").notEmpty().withMessage("Description is required"),
    check("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    handleValidationErrors,
];

router.put(
    "/:spotId",
    validateSpot,
    validateSpotId,
    requireAuth,
    async (req, res, next) => {
        const { spotId } = req.params;
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        } = req.body;

        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        try {
            await spot.update({
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            });

            return res.status(200).json({
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                description: spot.description,
                price: spot.price,
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
            });
        } catch (e) {
            next(e);
        }
    }
);

router.delete("/:spotId", requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }
    try {
        await spot.destroy();
        return res.status(200).json({ message: "Successfully deleted" });
    } catch (e) {
        next(e);
    }
});

const validateReviews = [
  check("review").notEmpty().withMessage("Review text is required"),
  check("stars").isInt({ min: 1, max: 5 }),
  handleValidationErrors
];

const validateBooking = [
    check('startDate')
      // .isISO8601().withMessage('startDate must be a valid date')
      .custom(value => {
        if (new Date(value) < new Date()) {
          throw new Error('startDate cannot be in the past');
        }
        return true;
      }),
    check('endDate')
      // .isISO8601().withMessage('endDate must be a valid date')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
          throw new Error('endDate cannot be on or before startDate');
        }
        return true;
      }),
  handleValidationErrors
];

router.post(
  "/:spotId/reviews",
  validateSpotId,
  validateReviews,
  requireAuth,
  async (req, res, next) => {
    try {
      const { spotId } = req.params;
      const { review, stars } = req.body;
      const userReview = await Review.findOne({
        where:{
            userId: req.user.id,
            spotId: spotId
        }
      })
      if(userReview){
        res.status(500).json( {message: "User already has a review for this spot"})
      }

      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }

      if (spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const newReview = await Review.create({
        spotId,
        review,
        stars,
        userId: req.user.id,
      });

      return res.status(201).json({
        id: newReview.id,
        spotId: Number(newReview.spotId),
        userId: req.user.id,
        review: newReview.review,
        stars: newReview.stars,
        createdAt: newReview.createdAt,
        updatedAt: newReview.updatedAt,


      });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/:spotId/bookings",
  validateSpotId,
  validateBooking,
  requireAuth,
  async (req, res, next) => {
   try {
      const { spotId } = req.params;
      const { startDate, endDate } = req.body;

      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }

      if (spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const newBooking = await Booking.create({
        spotId,
        userId: req.user.id,
        startDate,
        endDate
      });

      return res.status(201).json({
        id: newBooking.id,
        spotId: Number(newBooking.spotId),
        userId: req.user.id,
        startDate: newBooking.startDate,
        endDate: newBooking.endDate,
        createdAt: newBooking.createdAt,
        updatedAt: newBooking.updatedAt,


      });
    } catch (e) {
      next(e);
    }
  }
);


module.exports = router;
