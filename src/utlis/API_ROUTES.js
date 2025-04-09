const BASS_URL = "https://ambey.co.in";

const API_ROUTES = {
  LOGIN_API: `${BASS_URL}/APIServices/EmpLogin.aspx`,
  REGISTER_API: `${BASS_URL}/APIServices/EmployeeRegistration.aspx`,
  GET_DESIGNATION_API: `${BASS_URL}/APIServices/Get_Designation.aspx`,
  GET_DEPARTMENT_API: `${BASS_URL}/APIServices/GetDepartment.aspx`,
  GET_STATE_API: `${BASS_URL}/APIServices/GetStateData.aspx`,
  GET_CITY_API: `${BASS_URL}/APIServices/GetCityData.aspx`,
  GET_NOMINEE_RELATION: `${BASS_URL}/APIServices/Get_NomineeRelation.aspx`,
  GET_TITLE_API: `${BASS_URL}/APIServices/GetTitle.aspx`,
  GET_EMPLOYEE_DETAILS_API: `${BASS_URL}/APIServices/GetEmployeeDetail.aspx`,
};

export default API_ROUTES;
