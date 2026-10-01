import axios from "axios";
import {
  LoginCredential,
  ChangePasswordData,

} from "../DataTypes/dataTypes";

const hostname = window.location.hostname;
const middleURL = "/hub";
const bookURL = "/book";
const adminURL = "/admin";
const bookingURL = "/booking";
const report = "/report";
const masterURL = "/master";
const salesurl = "/sales"
const baseURL1 =
  hostname == "localhost"
    ? "https://devapiv2.skart-express.com/api/v1/auth"
    : hostname == "devbackoffice.skart-express.com"
    ? "https://devapiv2.skart-express.com/api/v1/auth"
    : "https://apiv2.skart-express.com/api/v1/auth";
const baseURL =
  hostname == "localhost"
    ? "https://devapiv2.skart-express.com/api/v1"
    : hostname == "devbackoffice.skart-express.com"
    ? "https://devapiv2.skart-express.com/api/v1"
    : "https://apiv2.skart-express.com/api/v1";

axios.defaults.withCredentials = true;

const redirectToLogin = (status: number) => {
  return window.location.replace("/");
};

// login api
export const Login = async (data: LoginCredential) => {
  try {
    return await axios.post(baseURL1 + "/login/0", data);
  } catch (err: any) {
    return err;
  }
};

// logout api
export const Logout = async () => {
  try {
    return await axios.get(baseURL1 + "/logout");
  } catch (err: any) {
    if (err.response.status === 401) {
      redirectToLogin(err.response.status);
    }
    return err;
  }
};

// Change password
export const ChangePassword = async (data: ChangePasswordData) => {
  try {
    return await axios.post(baseURL1 + "/change_password", data);
  } catch (err: any) {
    if (err.response.status === 401) {
      redirectToLogin(err.response.status);
    }
    return err;
  }
};


export const Forgot_pass_send_otp = async (username: string) => {
  try {
    return await axios.get(baseURL + `/auth/otp/${username}/6`);
  } catch (err: any) {
    if (err.response.status === 401) {
      redirectToLogin(err.response.status);
    }
    return err;
  }
};
// Forgot Password Verify Otp
export const Forgot_pass_verify_otp = async (username: string, otp: any) => {
  try {
    return await axios.post(baseURL + `/auth/otp/${username}`, { otp });
  } catch (err: any) {
    if (err.response.status === 401) {
      redirectToLogin(err.response.status);
    }
    return err;
  }
};
//Get hub info
export const Get_hub_info = async (id: any) => {
  try {
    return await axios.get(baseURL + `/admin/hub/${id}`);
  } catch (err: any) {
    if (err.response.status === 401) {
      redirectToLogin(err.response.status);
    }
    return err;
  }
};

// common delete
export const commonDelete = async (endpoint?: string, id?: number) => {
  try {
    const response = await axios.delete(
      baseURL + `/${endpoint}` + `/${id}`
    );

    return response;
  } catch (err: any) {
    return err;
  }
};
export const commonDeleteRequest = async (endpoint: string, obj: any) => {
  // console.log(obj,"objcoming")
  // console.log(obj,"shipmentdata")

  try {
    // console.log(obj, "objecttopass");
    const response = await axios.put(baseURL + `/${endpoint}`, obj);
    return response;
  } catch (err: any) {
    return err;
  }
};
// Auth verify
export const Auth_verify = async (endpoint?: any) => {
  try {
    return await axios.get(baseURL + `/${endpoint}`);
  } catch (err: any) {
    return err;
  }
};
// common post request with only endpoint and data

export const commonpostrequest = async (endpoint?: string | undefined, obj?: any) => {
  try {
    const response = await axios.post(baseURL + `/${endpoint}`, obj)
    return response
  } catch (err: any) {
    if (err?.response?.status == 401 && endpoint !== "/auth/verify/0") {
      window.location.href = "/";
    }
    return err;
  }
}

// common request for get

export const commongetrequest = async (endpoint?: string, params?: any) => {
  if (params) {
    try {
      const response = await axios.get(baseURL + `/${endpoint}`, params);
      return response;
    } catch (err: any) {
      if (err?.response?.status == 401 && endpoint !== "auth/verify/0") {
        window.location.href = "/";
      }
      return err;
    }
  } else {
    try {
      const response = await axios.get(baseURL + `/${endpoint}`);
      return response;
    } catch (err: any) {
      if (err?.response?.status == 401 && endpoint !== "auth/verify/0") {
        window.location.href = "/";
      }
      return err;
    }
  }

}
export const commonputrequest = async (endpoint?: string, obj?: any) => {
  try {
    const response = await axios.put(baseURL + `/${endpoint}`, obj)
    return response
  } catch (err: any) {
    if (err?.response?.status == 401 && endpoint !== "auth/verify/0") {
      window.location.href = "/";
    }
    return err
  }
}
export const commonpatchrequest = async (endpoint?: string, obj?: any) => {
  if (obj) {
    try {
      const response = await axios.patch(baseURL + `/${endpoint}`, obj);
      return response;
    } catch (err: any) {
      if (err?.response?.status == 401 && endpoint !== "auth/verify/0") {
        window.location.href = "/";
      }
      return err;
    }
  } else {
    try {
      const response = await axios.patch(baseURL + `/${endpoint}`);
      return response;
    } catch (err: any) {
      if (err?.response?.status == 401 && endpoint !== "/auth/verify/0") {
        window.location.href = "/";
      }
      return err;
    }
  }

};


export const universalpost = async (
  port?: string,
  endpoint?: string,
  data?: any
) => {
  // console.log(data,"data")
  try {
    const response = await axios.post(
      `http://localhost:${port}/api/v1/${endpoint}`,
      data
    );
    return response;
  } catch (err: any) {
    return err;
  }
};
export const universalget = async (port?: string, endpoint?: string,params?:any) => {
  // console.log(data,"data")
  try {
    const response = await axios.get(
      `http://localhost:${port}/api/v1/${endpoint}`,params?params:""
    );
    return response;
  } catch (err: any) {
    return err;
  }
};

