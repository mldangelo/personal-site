const pretendRequest = (email, pass, cb) => {
  setTimeout(() => {
    if (email === 'admin@mldangelo.com' && pass === 'password') {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7),
      });
    } else {
      cb({ authenticated: false });
    }
  }, 0);
};

const auth = {
  login(email, pass, cb) {
    cb = arguments[arguments.length - 1];
    if (localStorage.token) {
      if (cb) cb(true);
      this.onChange(true);
      return;
    }
    pretendRequest(email, pass, ({ authenticated, token }) => {
      if (authenticated) {
        localStorage.token = token;
        if (cb) cb(true);
        this.onChange(true);
      } else {
        if (cb) cb(false);
        this.onChange(false);
      }
    });
  },

  getToken() {
    return localStorage.token;
  },

  logout(cb) {
    delete localStorage.token;
    if (cb) cb();
    this.onChange(false);
  },

  loggedIn() {
    return !!localStorage.token;
  },

  onChange() {},
};

export default auth;
