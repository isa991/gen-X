function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

export async function authFetch(url, options = {}) {
  const token = getCookie("authToken");

  const headers = {
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...options.headers,
  };

  if (!(options?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(url, { ...options, headers });
}