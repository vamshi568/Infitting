import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://infitting-server.onrender.com/api";
// const API_URL = "http://192.168.1.17:5000/api";

export const register = async (name, email, password) => {
  const response = axios
    .post(`${API_URL}/auth/register`, { name, email, password })
    .then(async (res) => {
      await AsyncStorage.setItem("userId", res.data.userID);

      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return response;
};

export const login = async (email, password) => {
  const lating = axios
    .post(`${API_URL}/auth/login`, { email, password })
    .then(async (response) => {
      await AsyncStorage.setItem("userId", response.data.userID);
      return response;
    })
    .catch((err) => {
      return err.response;
    });
  return lating;
};
export const completedList = async () => {
  const token = await AsyncStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = axios
    .get(`${API_URL}/orders/completed`, config)

    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err.response;
    });
  return res;
};
export const incompletedList = async () => {
  const token = await AsyncStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = axios
    .get(`${API_URL}/orders/incompleted`, config)

    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err.response;
    });
  return res;
};
export const deleveredList = async () => {
  const token = await AsyncStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = axios
    .get(`${API_URL}/orders/delevered`, config)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err.response;
    });
  return res;
};

export const orderDetails = async ({ id }) => {
  const token = await AsyncStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = axios
    .get(`${API_URL}/orders/${id}`, config)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err.response;
    });
  return res;
};

export const createCustomer = async (customerData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(`${API_URL}/customers`, customerData, config);
    if (res.status === 200) {
      console.log("Customer created successfully");
      return res.data;
    } else {
      console.error("Failed to create customer");
    }
  } catch (error) {
    console.error(error);
  }
};

export const sendDataToServer = async (formData) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await axios.post(`${API_URL}/photos`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data.uri;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

export const createMeasurement = async (customer_id, measurementData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      `${API_URL}/measurements`,
      { customer_id, ...measurementData },
      config
    );
    if (res.status === 200) {
      console.log("Measurement created successfully");
      return res.data;
    } else {
      console.error("Failed to create measurement");
    }
  } catch (error) {
    console.error(error);
  }
};

export const searchCustomers = async (searchQuery) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(
      `${API_URL}/customers/search?search=${searchQuery}`,
      config
    );
    if (res.status === 200) {
      return res.data;
    } else {
      console.log("No customers found");
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};
export const getCustomer = async (profileId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${API_URL}/customers/${profileId}`, config);
    if (res.status === 200) {
      return res.data;
    } else {
      console.log("No customers found");
      return;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};
export const getMeasurement = async (measurementId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(
      `${API_URL}/measurements/${measurementId}`,
      config
    );
    if (res.status === 200) {
      return res.data;
    } else {
      console.log("No measurements found");
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put(
      `${API_URL}/customers/${id}`,
      customerData,
      config
    );
    if (res.status === 200) {
      console.log("Customer updated successfully");
      return res.data;
    } else {
      console.error("Failed to update customer");
    }
  } catch (error) {
    console.error(error);
  }
};

export const addOrder = async (orderData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(`${API_URL}/orders`, orderData, config);
    if (res.status === 200) {
      console.log("Order created successfully");
      return res;
    } else {
      console.error("Failed to create order");
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateOrder = async (id, orderData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put(`${API_URL}/orders/${id}`, orderData, config);
    if (res.status === 200) {
      console.log("Order updated successfully");
      return res;
    } else {
      console.error("Failed to update order");
    }
  } catch (error) {
    console.error(error);
  }
};

export const getProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(`${API_URL}/userDetails/${userId}`, config);
    if (res.status === 200) {
      
      return res.data;
    } else {
      console.error("Failed to get profile");
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteCustomer = async (id) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const res = await axios.delete(`${API_URL}/customers/${id}`, config);
    if (res.status === 200) {
      console.log("Customer deleted successfully");
      return res;
    } else {
      console.error("Failed to delete customer");
    }
  } catch (error) {
    console.error(error);
  }
};



export const editShop = async (shopData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(`${API_URL}/userDetails/savedata`, shopData, config);
    if (res.status === 200) {
      console.log("Shop updated successfully");
      return res;
    } else {
      console.error("Failed to update shop");
    }
  } catch (error) {
    console.error(error);
  }
}