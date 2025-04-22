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
export const getCityService = async (data) => {
  return await axios.post(API_ROUTES.GET_CITY_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getLocationsService = async (data) => {
  return await axios.post(API_ROUTES.GET_LOCATION_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getNomineeRelationService = async (data) => {
  return await axios.post(API_ROUTES.GET_NOMINEE_RELATION, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getTitleService = async (data) => {
  return await axios.post(API_ROUTES.GET_TITLE_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getEmployeeDetail = async (data) => {
  return await axios.post(API_ROUTES.GET_EMPLOYEE_DETAILS_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getDocType = async (data) => {
  return await axios.post(API_ROUTES.GET_DOC_TYPE_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getEmpDoc = async (data) => {
  return await axios.post(API_ROUTES.GET_EMP_DOC_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadEmpDocService = async (data) => {
  return await axios.post(API_ROUTES.UPLOAD_EMP_DOC_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
