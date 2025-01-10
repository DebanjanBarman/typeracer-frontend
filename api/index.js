// const baseURL = "https://typeracer-backend.infotrek24.tech";
const baseURL = "http://localhost:3000";
let api;
export default api = {
  baseURL: baseURL,
  login: `${baseURL}/api/users/login`,
  signup: `${baseURL}/api/users/signup`,
  forgotPassword: `${baseURL}/api/users/forgotPassword`,
  passwordReset: `${baseURL}/api/users/resetPassword`,
  gamesURL: `${baseURL}/api/games`,
  myGamesURL: `${baseURL}/api/games/my-games`,
  myGameURL: `${baseURL}/api/games/my-games`,
  savePerformance: `${baseURL}/api/performance`,
  leaderBoard: `${baseURL}/api/performance/leaderboard`,
  participation: `${baseURL}/api/games/participation`
}
