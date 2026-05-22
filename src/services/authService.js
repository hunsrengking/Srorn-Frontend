import axiosClient, {
  clearTokens,
  getAccessToken,
  isTokenExpired,
  setLogoutCallback,
} from "@/api/axiosClient";

export { getAccessToken, isTokenExpired, setLogoutCallback };

export const authService = {
  login: (credentials) => axiosClient.post("/login", credentials),

  logout: (token) =>
    axiosClient.post("/logout", null, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),

  clearSession: () => {
    clearTokens();
    delete axiosClient.defaults.headers.common.Authorization;
  },
};

export default authService;
