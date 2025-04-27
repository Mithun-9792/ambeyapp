import axios from "axios";
import API_ROUTES from "../utlis/API_ROUTES";

export const getClientListService = async (data) => {
  return await axios.post(API_ROUTES.GET_CLIENT_DETAILS_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getMonthsListService = async (data) => {
  return await axios.post(API_ROUTES.GET_MONTHS_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getYearsListService = async (data) => {
  return await axios.post(API_ROUTES.GET_YEAR_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
