import { User } from "@/types/interface";
import { ResponseSingle } from "@/types/interface";
import { baseUrl } from '../config/api';

export async function userLogIn(userEmail: string, userPassword: string) {
  const response = await fetch(
    `${baseUrl}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, password: userPassword }),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to log in");
  }
  return await response.json();
}

export async function userRegister(name: string, email: string, telephone: string, password: string) {
  const response = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, telephone, password, role: 'user' }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to register");
  }
  return await response.json();
}

export async function userLogout() {
  const response = await fetch(`${baseUrl}/auth/logout`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to log out");
  }
  return await response.json();
}

export async function userUpdate(token: string, updateData: { name?: string; email?: string; telephone?: string }) {
  const response = await fetch(`${baseUrl}/auth/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update user profile");
  }
  return await response.json();
}

export async function getUserProfile(token: string): Promise<ResponseSingle<User>> {
  const response = await fetch(
    `${baseUrl}/auth/me`,
    {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch user profile");
  }
  return await response.json();
}

/**
 * Safely decodes a JWT token payload.
 * Does not require any external dependencies.
 */
export function getPayloadFromToken(token?: string): any {
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    if (payloadBase64) {
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const decodedJson = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(decodedJson);
    }
  } catch (e) {
    console.error("Error decoding token payload", e);
  }
  return null;
}

export function getRoleFromToken(token?: string): string | null {
  const payload = getPayloadFromToken(token);
  return payload?.role || null;
}