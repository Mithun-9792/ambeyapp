import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "./screens/Onboarding";
import LoginScreen from "./screens/LoginScreen";
import { SCREENS } from "./constants/route";
import Dashboard from "./screens/Dashboard";
import EmployeeUploadDoc from "./screens/EmployeeUploadDoc";
import EmployeeRegistration from "./screens/EmployeeRegistration";
import EmployeeRegister from "./screens/EmployeeRegister";
import UserReport from "./screens/UserReport";

const Stack = createNativeStackNavigator();

export default function Routes() {
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
      <Stack.Screen
        name={SCREENS.DASHBOARD}
        options={{ headerShown: false }}
        component={Dashboard}
      />
      <Stack.Screen
        name={SCREENS.EMPLOYEEREGISTER}
        options={{ headerShown: true, title: "Employee Register" }}
        component={EmployeeRegister}
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
    </Stack.Navigator>
  );
}
