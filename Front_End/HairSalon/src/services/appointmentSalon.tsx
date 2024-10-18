import axios from "axios";
import { Appointment} from "../models/type";

export const getAppointmentsByCustomer = async (customerId: string): Promise<Appointment[]> => {
    try {
      const response = await axios.get(`https://api.vol-ka.studio/api/v1/appointmentget-all?CustomerId=${customerId}`);
      return response.data as Appointment[];  
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  };