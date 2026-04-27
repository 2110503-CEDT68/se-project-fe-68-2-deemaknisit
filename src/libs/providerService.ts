import { Provider, ProviderWithCars, ResponseList, ResponseSingle } from "@/../interface";
import { baseUrl } from '../config/api';

export async function getProviders(token?: string): Promise<ResponseList<ProviderWithCars>> {
  const headers: HeadersInit = {};
  if (token) headers.authorization = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}/providers`, { 
    headers,
    next: { tags: ['providers'] } 
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch providers");
  }
  return response.json();
}

export async function getProvider(id: string): Promise<ResponseSingle<ProviderWithCars>> {
  const response = await fetch(`${baseUrl}/providers/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch provider");
  }
  return response.json();
}

export async function createProvider(token: string, providerData: Partial<Provider>) {
  const response = await fetch(`${baseUrl}/providers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(providerData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create provider");
  }
  return await response.json();
}

export async function updateProvider(token: string, id: string, providerData: Partial<Provider>) {
  const response = await fetch(`${baseUrl}/providers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(providerData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update provider");
  }
  return await response.json();
}

export async function deleteProvider(token: string, id: string) {
  const response = await fetch(`${baseUrl}/providers/${id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete provider");
  }
  return await response.json();
}