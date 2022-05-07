export const SET_ERRORS = "SET_ERRORS";
export const HIDE_ERRORS = "HIDE_ERRORS";
export const HIDE_FORM_RELATED_ERRORS = "HIDE_FORM_RELATED_ERRORS";

export const setErrors = (errors) => {
  // console.log("inside action setErrors", errors);
  return {
    type: SET_ERRORS,
    payload: errors,
  };
};

export const hideErrors = () => {
  // Hide all errors
  return {
    type: HIDE_ERRORS,
  };
};

export const hideFormRelatedErrors = () => {
  // Hide form related errors
  return {
    type: HIDE_FORM_RELATED_ERRORS,
  };
};
