import Joi from 'joi';

export const profileSchema = Joi.object({
  userId: Joi.string().optional(),
  profilePhoto: Joi.object({
    img: Joi.object({
      url: Joi.string().uri().required(),
      public_id: Joi.string().required(),
    }).required(),
  }).optional(),
  coverPhotos: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
      }),
    )
    .optional(),

  about: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().required(),
    phone_number: Joi.string().required(),
    gender: Joi.string().valid('Male', 'Female').optional(),
    birthDate: Joi.date().required(),
    height: Joi.string().optional(),
    maritalStatus: Joi.string()
      .valid('Single', 'Separated', 'Divorced', 'Widowed')
      .optional(),
    tagline: Joi.string().max(120).optional(),
  }).required(),

  interests: Joi.array()
    .items(
      Joi.string().valid(
        'Photography',
        'Shopping',
        'Karaoke',
        'Yoga',
        'Cooking',
        'Tennis',
        'Running',
        'Swimming',
        'Art',
        'Traveling',
        'Extreme Sports',
        'Music',
        'Drinking',
        'Video Games',
      ),
    )
    .optional(),

  religiosity: Joi.object({
    muslimSect: Joi.string().valid('Sunni', 'Shia', 'Other').required(),
    isConvert: Joi.string().valid('Yes', 'No').required(),
    religiousPractice: Joi.string()
      .valid('Strict', 'Moderate', 'Liberal')
      .required(),
    doYouPray: Joi.string()
      .valid('Regularly', 'Occasionally', 'Rarely')
      .required(),
    diet: Joi.string()
      .valid('Halal', 'Halal and Non-Halal', 'Vegan', 'Vegetarian')
      .required(),
    doYouSmoke: Joi.string().valid('Yes', 'No', 'Occasionally').required(),
    hasTattoos: Joi.string().valid('Yes', 'No').required(),
  }).required(),

  marriageIntentions: Joi.object({
    lookingToMarry: Joi.string()
      .valid('Within 1 year', '1-2 years', '2-3 years', '3-5 years')
      .required(),
    willingToRelocate: Joi.string().valid('Yes', 'No', 'Maybe').required(),
    wantsChildren: Joi.string().valid('Yes', 'No', 'Maybe').required(),
    livingArrangements: Joi.string()
      .valid('Living alone', 'Living with family', 'Living with roommates')
      .required(),
    iceBreaker: Joi.string().max(120).optional(),
  }).required(),

  languageAndEthnicity: Joi.object({
    languages: Joi.string()
      .valid('English', 'Arabic', 'Urdu', 'Bengali', 'Other')
      .required(), // Assuming a single language
    ethnicGroup: Joi.string()
      .valid('Asian', 'Black', 'Hispanic', 'Middle Eastern', 'White', 'Other')
      .required(),
    ethnicOrigin: Joi.string()
      .valid('Indian', 'Pakistani', 'Bangladeshi', 'Arab', 'Turkish', 'Other')
      .required(),
    biography: Joi.string().max(500).optional(),
  }).required(),

  educationAndCareer: Joi.object({
    profession: Joi.string()
      .valid('Doctor', 'Engineer', 'Teacher', 'Business', 'Other')
      .required(),
    education: Joi.string()
      .valid('High School', "Bachelor's", "Master's", 'PhD', 'Other')
      .required(),
    jobTitle: Joi.string()
      .valid('Manager', 'Developer', 'Designer', 'Analyst', 'Other')
      .required(),
  }).required(),

  likes: Joi.array().items(Joi.object()).optional(), // Assuming ObjectId references
  favorites: Joi.array().items(Joi.object()).optional(), // Assuming ObjectId references
});

export const transformProfileSchema = (data) => {
  const transformedData = {
    ...data,

    // Ensure languages is a single string instead of an array
    languageAndEthnicity: {
      ...data.languageAndEthnicity,
      languages: Array.isArray(data.languageAndEthnicity.languages)
        ? data.languageAndEthnicity.languages[0] // Assuming you want to take the first language as a string
        : data.languageAndEthnicity.languages,
    },

    marriageIntentions: {
      ...data.marriageIntentions,
      lookingToMarry: data.marriageIntentions.lookingToMarry,
      willingToRelocate: data.marriageIntentions.willingToRelocate,
      wantsChildren: data.marriageIntentions.wantsChildren,
    },

    religiosity: {
      ...data.religiosity,
      isConvert: data.religiosity.isConvert,
      hasTattoos: data.religiosity.hasTattoos,
      doYouSmoke: data.religiosity.doYouSmoke,
      doYouPray: data.religiosity.doYouPray,
    },

    about: {
      ...data.about,
      height: data.about.height || null, // Default to null if not provided
    },

    interests: Array.isArray(data.interests)
      ? [...new Set(data.interests)]
      : [], // Remove duplicates from interests
  };

  return transformedData;
};
