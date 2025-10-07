
export interface UserData {
  role: string;
  sub: string;
  iat: number;
  exp: number;
}


export interface Error {
  message: string;
}

export interface Setting {
  route: string;
  label: string;
  state?: unknown;
}
export function logout(userData: UserData | null) {
  if (userData) {
    localStorage.removeItem("token");
  }
  localStorage.removeItem("token");
}

const decodeToken = (token: string): UserData | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedData = JSON.parse(atob(base64)) as UserData;
    return decodedData;
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token: UserData | null): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  if (token) {
    return token.exp < currentTime;
  }
  return true;
};

export function getJwtToken() {
  const token = localStorage.getItem("token");
  let userData = null;
  let isExpired = true;
  if (token) {
    // Decode the JWT to extract user information
    userData = decodeToken(token);
    if (userData) {
      // Set the user data in the state
      isExpired = isTokenExpired(userData);
    }
  }
  return { userData, expired: isExpired };
}

export function fetchImageName(url: string) {
  const list = url.split("/");
  const imageNameWithExtension = list[list.length - 1];
  return imageNameWithExtension.split(".")[0];
}
