import axios from "axios";

export async function checkAccessAndRefreshToken(
  method: string,
  url: string,
  data: any,
  config: any,
  error: string
) {
  let options = {};
  if (method === "GET") {
    options = {
      method,
      url,
      ...config,
    };
  } else {
    options = {
      method,
      url,
      data,
      ...config,
    };
  }
  let response = await axios(options);
  if (response.status === 200) return response;
  else if (response.status === 401 || response.status === 403) {
    // Likely authentication error
    if (response.status === 401) {
      throw new Error(error);
    } else if (response.status === 403) {
      await axios.get("http://localhost:5000/auth/token", config);
      response = await axios(options);
    }
  } else {
    // Likely server / some other error, so need to return something here that resembles the server error
    return response;
  }

  // If the attempt was retried due to authentication hitting refresh token endpoint, we reach here
  if (response.status === 200) return response;
  else if (response.status === 401 || response.status === 403) {
    throw new Error(error);
  } else {
    // Some kind of server error
    return response;
  }
}
