const cookieUtils = {
  getAuthToken: () => {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
  },
  setAuthToken: (token: string) => {
    document.cookie = `token=${token}; path=/; max-age=3600; secure`;
  },
  removeAuthToken: () => {
    document.cookie = 'token=; path=/; max-age=0; secure';
  },
  clearAuthCookies: () => {
    document.cookie = 'token=; path=/; max-age=0; secure';
  },
};
export default cookieUtils;
