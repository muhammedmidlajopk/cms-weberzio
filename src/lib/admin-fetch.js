export async function adminFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 401 && typeof window !== "undefined") {
    const current = window.location.pathname + window.location.search;
    window.location.href = `/control/login?next=${encodeURIComponent(current)}`;
    return new Promise(() => {});
  }
  return res;
}
