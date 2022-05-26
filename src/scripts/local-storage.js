/*** LOCAL STORAGE ***/
export const updateLocalStorage = (name, array) => localStorage.setItem(name, JSON.stringify(array));
export const getItemFromLocal = (name) => JSON.parse(localStorage.getItem(name));
export const deleteLocalStorage = (name) => localStorage.removeItem(name);