export const prerender = true;
export const ssr = true;

export const load = async () => {
  if (typeof window !== 'undefined') {
    const { registerServiceWorker } = await import('$lib/pwa');
    registerServiceWorker();
  }
  return {};
}; 