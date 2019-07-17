const localStorage = window.localStorage;

export default key => ({
  get: () => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  set: (value) => {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    return undefined;
  },
});
