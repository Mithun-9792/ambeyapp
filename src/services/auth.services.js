import axios from "axios";
import API_ROUTES from "../utlis/API_ROUTES";

export const loginService = async (data) => {
  return await axios.post(API_ROUTES.LOGIN_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const registerService = async (data) => {
  return await axios.post(API_ROUTES.REGISTER_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getDesignationService = async (data) => {
  return await axios.post(API_ROUTES.GET_DESIGNATION_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getDepartmentService = async (data) => {
  return await axios.post(API_ROUTES.GET_DEPARTMENT_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getStateService = async (data) => {
  return await axios.post(API_ROUTES.GET_STATE_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
