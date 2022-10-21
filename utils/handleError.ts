function accessTokenExpired() {
  throw new Error("Access Token has expired");
}

function accessTokenNotFound() {
  throw new Error("Access token not found.");
}

function accessTokenInvalid() {
  throw new Error("Invalid Access Token");
}

function accessTokenGenerationFail() {
  throw new Error("Access token generation failed, please try again.");
}

function refreshTokenExpired() {
  throw new Error("Refresh Token has expired");
}

function refreshTokenNotFound() {
  throw new Error("Refresh token not found.");
}

function refreshTokenInvalid() {
  throw new Error("Invalid Refresh Token");
}

function passwordInvalid() {
  throw new Error("Password not valid!");
}

function userNotFound() {
  throw new Error("No user found");
}

function emailAlreadyExist() {
  throw new Error("Email already Exist!");
}

function emailInvalid() {
  throw new Error("Email not valid!");
}

export default {
  accessTokenExpired,
  accessTokenInvalid,
  accessTokenNotFound,
  accessTokenGenerationFail,
  refreshTokenExpired,
  refreshTokenInvalid,
  refreshTokenNotFound,
  passwordInvalid,
  userNotFound,
  emailAlreadyExist,
  emailInvalid,
};
