import asyncHandler from '../../utils/asyncHandler.js';
import {
  profileSchema,
  transformProfileSchema,
} from '../../utils/profileDataValidation.js';

export const validateProfileDetails = asyncHandler(async (req, res, next) => {
  const transformedData = await transformProfileSchema(req.body);

  const { error } = await profileSchema.validate(transformedData, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ error: error.details.map((e) => `${e.message} \n`) });
  }

  req.body = transformedData; // Assign validated and transformed data back to req.body
  next(); // Proceed to the next middleware/controller
});
