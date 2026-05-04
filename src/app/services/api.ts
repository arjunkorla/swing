const API_BASE = "http://127.0.0.1:8000";

export async function getScanner(token: string) {

  const response = await fetch(
    `${API_BASE}/scanner?token=${token}`
  );

  return response.json();
}

export async function getLiveData() {

  const response = await fetch(
    `${API_BASE}/live-data`
  );

  return response.json();
}