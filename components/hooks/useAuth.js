import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  return useContext(AuthContext);
};

import * as Notifications from "expo-notifications";


export const scheduleNotification = async (order) => {
  const deliveryDate = new Date(order.deliveryDate);
  const now = new Date();
  const timeDiff = deliveryDate - now;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${order.name}'s ${order.type} `,
      body: `The order ${order.type} should be completed before ${deliveryDate.toLocaleDateString()}.`,
      sound: true, 
      data: { orderId: order._id, url: `/details/${order._id}` },

    },
    trigger: { seconds: timeDiff - (8 * 60 * 60) }, 
  });
};

