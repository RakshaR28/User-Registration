import axios from "axios";

const BASE_URL = "http://18.61.201.138:8080/users";

// CREATE USER
export const saveUser = async (userData) => {
  try {
    const response = await axios.post(BASE_URL, userData);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || "Error occurred";
  }
};

// GET LATEST 5 USERS
export const getUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/latest`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || "Error occurred";
  }
};
