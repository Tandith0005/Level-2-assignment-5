"use client";

import { useState, useEffect } from "react";
import { User } from "../types";
import axiosInstance from "../lib/axios";
import { useRouter } from 'next/navigation'

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
};

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      
      // If no token, skip API call entirely (Prevents the 401 request completely!)
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const res = await axiosInstance.get("/auth/me");
        const userData = res.data?.data || res.data;
        setUser(userData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          setUser(null);
        }
        // Only log real errors, ignore 401 (user not logged in)
        if (error.response?.status !== 401) {
          console.error("Auth check failed:", error);
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem("accessToken", token);
    setUser(userData);
    router.push("/");
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      router.push("/");
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
};