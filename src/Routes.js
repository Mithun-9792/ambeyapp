import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "./screens/Onboarding";
import LoginScreen from "./screens/LoginScreen";
import { SCREENS } from "./constants/route";
import Dashboard from "./screens/Dashboard";
import EmployeeUploadDoc from "./screens/EmployeeUploadDoc";
import EmployeeRegistration from "./screens/EmployeeRegistration";
import UserReport from "./screens/UserReport";
import VehicleLog from "./screens/VehicleLog";
import MarkAttendence from "./screens/MarkAttendence";
import AttendenceReport from "./screens/AttendenceReport";

const Stack = createNativeStackNavigator();

export function AppStack() {
  return (
    <Stack.Navigator initialRouteName={SCREENS.ONBOARDING}>
      <Stack.Screen
        name={SCREENS.ONBOARDING}
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREENS.LOGIN}
        options={{ headerShown: false }}
        component={LoginScreen}
      />
    </Stack.Navigator>
  );
}
export function Routes() {
  return (
    <Stack.Navigator initialRouteName={SCREENS.DASHBOARD}>
      <Stack.Screen
        name={SCREENS.DASHBOARD}
        options={{ headerShown: false }}
        component={Dashboard}
      />
      <Stack.Screen
        name={SCREENS.EMPLOYEEREGISTRATION}
        options={{ headerShown: true, title: "Employee Register" }}
        component={EmployeeRegistration}
      />
      <Stack.Screen
        name={SCREENS.EMPLOYEEUPLOADDOC}
        options={{ headerShown: true, title: "Employee Upload Doc" }}
        component={EmployeeUploadDoc}
      />
      <Stack.Screen
        name={SCREENS.USERREPORT}
        options={{ headerShown: true, title: "User Report" }}
        component={UserReport}
      />
      <Stack.Screen
        name={SCREENS.VEHICLELOG}
        options={{ headerShown: true, title: "Vehicle Log" }}
        component={VehicleLog}
      />
      <Stack.Screen
        name={SCREENS.MARKATTENDENCE}
        options={{ headerShown: true, title: "Mark Attendence" }}
        component={MarkAttendence}
      />
      <Stack.Screen
        name={SCREENS.ATTENDECEREPORT}
        options={{ headerShown: true, title: "Attendence Report" }}
        component={AttendenceReport}
      />
    </Stack.Navigator>
  );
}
