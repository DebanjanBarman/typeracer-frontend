const baseURL = "https://typeracer-backend.infotrek24.tech";
let api;
export default api = {
  login: `${baseURL}/api/users/login`,
  signup: `${baseURL}/api/users/signup`,
  forgotPassword: `${baseURL}/api/users/forgotPassword`,
  passwordReset: `${baseURL}/api/users/resetPassword`,
  gamesURL: `${baseURL}/api/games`,
  savePerformance: `${baseURL}/api/performance`,
  leaderBoard: `${baseURL}/api/performance/leaderboard`,
  participation: `${baseURL}/api/games/participation`
}
