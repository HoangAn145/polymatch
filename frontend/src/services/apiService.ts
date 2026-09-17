// Lấy URL từ biến môi trường, nếu không có mới dùng localhost để test dưới máy
const JAVA_BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export async function fetchGeminiAdvice(assessmentData: any) {
  try {
    const response = await fetch(`${JAVA_BACKEND_URL}/gemini/advisor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessmentData),
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi gọi Java Backend:', error);
    throw error;
  }
}

export async function registerUser(data: { fullName: string; email: string; password: string; role?: string }) {
  const response = await fetch(`${JAVA_BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function lookupTaxCode(taxCode: string) {
  const response = await fetch(`${JAVA_BACKEND_URL}/auth/tax-lookup/${taxCode.trim()}`);
  return response.json();
}