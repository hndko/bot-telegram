const axios = require("axios");
const { API_URL } = require("../config/config");

class ApiService {
  static async getRandomAnimeImage() {
    try {
      const response = await axios.get(API_URL);
      if (response.data && response.data.length > 0) {
        return response.data[0].url;
      }
      throw new Error("No image found");
    } catch (error) {
      console.error("Error fetching anime image:", error.message);
      throw error;
    }
  }
}

module.exports = ApiService;
