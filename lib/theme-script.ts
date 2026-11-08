export const THEME_STORAGE_KEY = "theme";

// Runs in <head> before first paint. The server always renders class="dark",
// so this only has to remove it when the visitor picked light.
export const themeInitScript = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light")document.documentElement.classList.remove("dark")}catch(e){}`;
