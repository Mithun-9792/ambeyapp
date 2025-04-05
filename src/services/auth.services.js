import axios from "axios";
import API_ROUTES from "../utlis/API_ROUTES";

export const loginService = async (data) => {
  return await axios.post(API_ROUTES.LOGIN_API, data);
};

export const registerService = async (data) => {
  return await axios.post(API_ROUTES.REGISTER_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
