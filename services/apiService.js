const axios = require("axios");
const { API_URL, SHOLAT_API_URL, TITANZ_API_KEY } = require("../config/config");

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

  static async getJadwalSholat(kota = "Jakarta") {
    try {
      // Validasi input kota
      if (!kota || typeof kota !== "string") {
        throw new Error("Nama kota tidak valid");
      }

      const response = await axios.get(SHOLAT_API_URL, {
        params: {
          kota: encodeURIComponent(kota.trim()),
          apikey: TITANZ_API_KEY,
        },
        timeout: 5000,
      });

      if (response.data?.status !== true || !response.data.jadwal) {
        throw new Error(response.data?.message || "Format respons tidak valid");
      }

      return response.data.jadwal;
    } catch (error) {
      console.error("API Error:", error.message);
      throw new Error(`Gagal mendapatkan jadwal sholat untuk ${kota}`);
    }
  }
}

module.exports = ApiService;
