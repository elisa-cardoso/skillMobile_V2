import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.121:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {

    const token = await AsyncStorage.getItem('token');

    if (token) {
      if (config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    console.error("Erro na resposta da API:", error);
    if (error.response && error.response.status === 401) {
      console.error("Token expirado ou não autorizado. Redirecionando para o login...");
      await AsyncStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// const testConnection = async () => {
//   try {
//     const response = await api.get("/");
//     console.log("Resposta do servidor:", response);
//   } catch (error) {
//     console.error("Erro ao se comunicar com o back-end:", error);
//   }
// };
// testConnection();

export default api;
