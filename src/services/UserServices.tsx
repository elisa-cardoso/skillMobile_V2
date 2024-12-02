import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./Api";
import { LoginResponse, LoginRequest } from "../@types/user";
import { isAxiosError } from "axios";

export async function signIn(login: string, password: string): Promise<LoginResponse> {
    const requestData: LoginRequest = { login, password };
    try {
      const response = await api.post<LoginResponse>("/auth/login", requestData);
      console.log("Resposta da API:", response.data);
      
      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
      }
  
      if (response.data.login) {
        await AsyncStorage.setItem("login", response.data.login);
      }
  
      return {
        token: response.data.token,
        login: response.data.login,
      };
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Erro ao fazer login:", error.response);
        const errorMessage = error.response?.data?.message || "Erro ao fazer login";
        throw new Error(errorMessage);
      }
      console.error("Erro desconhecido:", error);
      throw new Error("Erro desconhecido");
    }
  }

  export async function logout() {
    try {
      await AsyncStorage.removeItem("token");
      delete api.defaults.headers.Authorization;
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  }
  
  export async function isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem("token");
    return !!token;
  }