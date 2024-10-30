import axios from "axios";

export const login = async (email: string, password: string) => {
    try {
       const response = await axios.post('https://api.vol-ka.studio/api/v1/auth/login', {

        email,
        password
      });
     // Check if response contains token, email, and roleName
     if (response.data && response.data.token && response.data.email && response.data.roleName) {
      const { token, email: userEmail, roleName ,accountId} = response.data;
      
      // Store token and userData in localStorage
      localStorage.setItem('token', token);
      const userDatas = { email: userEmail, roleName ,accountId};
      localStorage.setItem('userData', JSON.stringify(userDatas));
  
      return { token, userDatas };
    } else {
      throw new Error('Invalid login response');
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Login failed");
  }
  };

  export const signUpUser = async (submissionData: FormData) => {
    try {
      const response = await axios.post(`https://api.vol-ka.studio/api/v1/member/add`, submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return { success: response.status === 201, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  };