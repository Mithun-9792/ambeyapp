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

export const getVehicleNumberListService = async (data) => {
  return await axios.post(API_ROUTES.GET_VEHICLE_NUMBER_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const addMonthlyLogService = async (data) => {
  return await axios.post(API_ROUTES.ADD_MONTHLY_LOG_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getVehicleRunningMonthlyLogReport = async (data) => {
  return await axios.post(
    API_ROUTES.GET_VEHICLE_RUNNING_MONTHLY_LOG_REPORT,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getUserListService = async (data) => {
  return await axios.post(API_ROUTES.GET_USER_LIST_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getLeaveTypeListService = async (data) => {
  return await axios.post(API_ROUTES.GET_LEAVE_TYPE_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const lockAttendenceService = async (data) => {
  return await axios.post(API_ROUTES.LOCK_ATTENDENCE_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAttendenceReportService = async (data) => {
  return await axios.post(API_ROUTES.ATTENDENCE_REPORT_API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
