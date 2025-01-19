export const TokenManager = {
    setToken: (token) => {
      document.cookie = `authToken=${token}; Path=/; HttpOnly; Secure`;
    },
    getToken: () => {
      const cookies = document.cookie.split('; ');
      const tokenCookie = cookies.find(row => row.startsWith('authToken='));
      return tokenCookie ? tokenCookie.split('=')[1] : null;
    },
    removeToken: () => {
      document.cookie = 'authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  };