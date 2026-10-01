import axios from "axios";

const hostname = window.location.hostname;
const baseURL =
  hostname == "localhost"
    ? "https://devapiv2.skart-express.com/api/v1"
    : hostname == "devbackoffice.skart-express.com"
    ? "https://devapiv2.skart-express.com/api/v1"
    : "https://apiv2.skart-express.com/api/v1";

// Rewrite master API paths to go through the booking backend proxy.
// /api/v1/master/internal/foo  →  /booking/vendor-registration/foo
// /api/v1/master/foo           →  /booking/vendor-registration/foo
const toProxyPath = (url: string): string =>
  url.replace(/\/api\/v1\/master\/(internal\/)?/, "/booking/vendor-registration/");

export const masterGET = async (url: string, params?: any) => {
  try {
    return await axios.get(baseURL + toProxyPath(url), {
      params,
      withCredentials: true,
    });
  } catch (err: any) {
    return err;
  }
};

export const masterPOST = async (url: string, data?: any) => {
  try {
    return await axios.post(baseURL + toProxyPath(url), data, {
      withCredentials: true,
    });
  } catch (err: any) {
    return err;
  }
};

export const masterPUT = async (url: string, data?: any) => {
  try {
    return await axios.put(baseURL + toProxyPath(url), data, {
      withCredentials: true,
    });
  } catch (err: any) {
    return err;
  }
};

export const masterDELETE = async (url: string) => {
  try {
    return await axios.delete(baseURL + toProxyPath(url), {
      withCredentials: true,
    });
  } catch (err: any) {
    return err;
  }
};
