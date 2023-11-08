import { providersMap } from './utils';
type ProviderType = 'image' | 'json';

export default function uploadToProviders(providers: string[], type: ProviderType, params: any) {
  const configuredProviders = providers.filter(p => providersMap[p].isConfigured());

  return Promise.any(
    configuredProviders.map(async name => {
      const type: ProviderType = params instanceof Buffer ? 'image' : 'json';
      try {
        const result = await providersMap[name].set(params);
        return result;
      } catch (e: any) {
        if (e instanceof Error) {
          if (e.message !== 'Request timed out') {
            console.error(e);
          }
        } else {
          console.error(e);
        }
        return Promise.reject(e);
      } finally {
      }
    })
  );
}
