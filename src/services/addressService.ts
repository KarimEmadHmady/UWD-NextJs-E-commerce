export interface AddressPayload {
  label: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2?: string;
  city: string;
  region: string; // <-- بدلاً من state
  country: string;
  lat: number;
  long: number;
}

export interface AddAddressResponse {
  id: string | number;
}

export async function addAddressService(address: AddressPayload, token: string): Promise<AddAddressResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE}/create/address`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add address');
  }
  return response.json();
}

export async function fetchUserAddresses(token: string) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE}/user/addresses`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch addresses');
  }
  // Return only the array of addresses
  return Array.isArray(data.data) ? data.data : [];
}

export async function updateAddressService(address: AddressPayload & { id: string }, token: string) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE}/user/address/update/${address.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update address');
  }
  return response.json();
} 

