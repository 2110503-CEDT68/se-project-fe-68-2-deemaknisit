import { Car, Provider, ResponseList, ResponseSingle } from "@/../interface";
import { baseUrl } from '../config/api';

export async function getCars(token?: string): Promise<ResponseList<Car>> {
  const headers: HeadersInit = {};
  if (token) headers.authorization = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}/cars`, { 
    headers,
    next: { tags: ['cars'] } 
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch cars");
  }
  return response.json();
}

export async function getCar(id: string): Promise<ResponseSingle<Car>> {
  const response = await fetch(`${baseUrl}/cars/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch car");
  }
  return response.json();
}

export async function createCar(token: string, carData: Partial<Car>) {
  const response = await fetch(`${baseUrl}/cars`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(carData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create car");
  }
  return await response.json();
}

export async function updateCar(token: string, id: string, carData: Partial<Car>) {
  const response = await fetch(`${baseUrl}/cars/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(carData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update car");
  }
  return await response.json();
}

export async function deleteCar(token: string, id: string) {
  const response = await fetch(`${baseUrl}/cars/${id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete car");
  }
  return await response.json();
}