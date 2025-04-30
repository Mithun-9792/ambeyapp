const BASS_URL = "https://ambey.co.in";

const API_ROUTES = {
  LOGIN_API: `${BASS_URL}/APIServices/EmpLogin.aspx`,
  REGISTER_API: `${BASS_URL}/APIServices/EmployeeRegistration.aspx`,
  GET_DESIGNATION_API: `${BASS_URL}/APIServices/Get_Designation.aspx`,
  GET_DEPARTMENT_API: `${BASS_URL}/APIServices/GetDepartment.aspx`,
  GET_STATE_API: `${BASS_URL}/APIServices/GetStateData.aspx`,
  GET_CITY_API: `${BASS_URL}/APIServices/GetCityData.aspx`,
  GET_LOCATION_API: `${BASS_URL}/APIServices/Get_LocationData.aspx`,
  GET_NOMINEE_RELATION: `${BASS_URL}/APIServices/Get_NomineeRelation.aspx`,
  GET_TITLE_API: `${BASS_URL}/APIServices/GetTitle.aspx`,
  GET_EMPLOYEE_DETAILS_API: `${BASS_URL}/APIServices/GetEmployeeDetail.aspx`,
  GET_DOC_TYPE_API: `${BASS_URL}/APIServices/GetDocumentType.aspx`,
  GET_EMP_DOC_API: `${BASS_URL}/APIServices/GetEmployeeDocument.aspx`,
  UPLOAD_EMP_DOC_API: `${BASS_URL}/APIServices/UploadEmployeeDocument.aspx`,
  GET_CLIENT_DETAILS_API: `${BASS_URL}/APIServices/GetClientDetail.aspx`,
  GET_MONTHS_API: `${BASS_URL}/APIServices/GetMonths.aspx`,
  GET_YEAR_API: `${BASS_URL}/APIServices/GetYears.aspx`,
  GET_VEHICLE_NUMBER_API: `${BASS_URL}/APIServices/GetVehicleNumbers.aspx`,
  ADD_MONTHLY_LOG_API: `${BASS_URL}/APIServices/SaveVehicleRunningMonthlyLog.aspx`,
};

export default API_ROUTES;
