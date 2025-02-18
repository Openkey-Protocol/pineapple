import express from 'express';
import { MAX, rpcError, rpcSuccess } from './utils';
import { set as setAws } from './aws';
import uploadToProviders from './providers/';
import { JSON_PROVIDERS } from './providers/utils';

const router = express.Router();

router.post('/', async (req, res) => {
  const { id, params } = req.body;

  if (!params) {
    return rpcError(res, 400, 'Malformed body', id);
  }

  try {
    const size = Buffer.from(JSON.stringify(params)).length;
    if (size > MAX) return rpcError(res, 400, 'File too large', id);

    // console.log(params);

    const result = await uploadToProviders(JSON_PROVIDERS, 'json', params);
    try {
      await setAws(result.cid, params);
    } catch (e: any) {
      console.error(e);
    }

    return rpcSuccess(res, { ...result, size }, id);
  } catch (e: any) {
    console.error(e);
    return rpcError(res, 500, e, id);
  }
});

export default router;
