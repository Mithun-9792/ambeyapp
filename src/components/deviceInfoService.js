import { PermissionsAndroid, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geolocation from "@react-native-community/geolocation";
import DeviceInfo from "react-native-device-info";

const STORAGE_KEY = "DEVICE_INFO_DATA";

/**
 * Requests location permission (Android only)
 * @returns {Promise<boolean>} true if permission granted
 */
const requestLocationPermission = async () => {
  if (Platform.OS !== "android") return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "This app needs access to your location",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn("Error requesting location permission:", err);
    return false;
  }
};

/**
 * Gets current device location
 * @returns {Promise<{latitude: number, longitude: number}>}
 * @throws {Error} If location cannot be obtained
 */
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Location error: ${error.message}`));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

/**
 * Gets complete device information including location
 * @param {boolean} [forceFreshLocation=false] Whether to ignore cached location
 * @returns {Promise<{
 *   deviceId: string,
 *   deviceName: string,
 *   latitude: number,
 *   longitude: number,
 *   timestamp: string
 * }>}
 */
export const getDeviceInfo = async (forceFreshLocation = false) => {
  try {
    // Get basic device info
    const deviceId = DeviceInfo.getUniqueId();
    const deviceName = await DeviceInfo.getDeviceName();

    // Check if we have cached data
    const cachedData = await getCachedDeviceInfo();
    const shouldUseCache = cachedData && !forceFreshLocation;

    if (shouldUseCache) {
      return {
        ...cachedData,
        cached: true,
      };
    }

    // Get fresh location data
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error("Location permission not granted");
    }

    const location = await getCurrentLocation();
    const timestamp = new Date().toISOString();

    // Prepare complete data object
    const deviceData = {
      deviceId,
      deviceName,
      ...location,
      timestamp,
      cached: false,
    };

    // Cache the data
    await cacheDeviceInfo(deviceData);

    return deviceData;
  } catch (error) {
    console.error("Error in getDeviceInfo:", error);
    throw error;
  }
};

/**
 * Caches device info to AsyncStorage
 * @param {object} data Device info data to cache
 */
export const cacheDeviceInfo = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to cache device info:", error);
  }
};

/**
 * Retrieves cached device info from AsyncStorage
 * @returns {Promise<object|null>} Cached data or null if not found
 */
export const getCachedDeviceInfo = async () => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.warn("Failed to read cached device info:", error);
    return null;
  }
};

/**
 * Clears cached device info from AsyncStorage
 */
export const clearCachedDeviceInfo = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear cached device info:", error);
  }
};
