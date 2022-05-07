import {
  SET_ERRORS,
  HIDE_ERRORS,
  HIDE_FORM_RELATED_ERRORS,
} from "../action_creators/errors_actions";

const initState = {
  errors: {
    form_related: [],
    fields: {},
    system: [],
  },
};

export const errorsReducer = (state = initState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ERRORS:
      // console.log("inside errorsReducer -> type:SET_ERRORS", payload);
      return {
        errors: payload,
      };
    case HIDE_ERRORS:
      return initState;
    case HIDE_FORM_RELATED_ERRORS:
      return {
        errors: {
          ...state.errors,
          form_related: [],
        },
      };
    default:
      return initState;
  }
};
