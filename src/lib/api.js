export const apiResponse = (res, status, data, message) => {
  return res.status(status).json({
    success: status >= 200 && status < 300,
    data,
    message,
  });
};

export const handleError = (res, error) => {
  console.error(error);
  return apiResponse(
    res,
    error.status || 500,
    null,
    error.message || 'Internal server error'
  );
};

export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      return apiResponse(
        res,
        400,
        null,
        error.errors.join(', ')
      );
    }
  };
}; 