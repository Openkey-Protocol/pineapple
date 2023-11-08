import { capture } from '@snapshot-labs/snapshot-sentry';
import { providersMap } from './utils';
type ProviderType = 'image' | 'json';

export default function uploadToProviders(providers: string[], type: ProviderType, params: any) {
  const configuredProviders = providers.filter(p => providersMap[p].isConfigured());

  return Promise.any(
    configuredProviders.map(async name => {
      const type: ProviderType = params instanceof Buffer ? 'image' : 'json';
      let status = 0;

      try {

        const result = await providersMap[name].set(params);
        status = 1;

        return result;
      } catch (e: any) {
        if (e instanceof Error) {
          if (e.message !== 'Request timed out') {
            capture(e, { name });
          }
        } else {
          capture(new Error(`Error from ${name} provider`), {
            contexts: { provider_response: e }
          });
        }
        return Promise.reject(e);
      } finally {
      }
    })
  );
}
