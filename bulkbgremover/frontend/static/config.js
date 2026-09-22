const CLOUD_API_URL = "https://bulkbgremover.onrender.com";
const LOCAL_API_URL = "http://localhost:5000";

let API_URL = localStorage.getItem("bgremover_mode") === "local" ? LOCAL_API_URL : CLOUD_API_URL;
let currentMode = localStorage.getItem("bgremover_mode") || null;
