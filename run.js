import {rlp, BN, fromRpcSig, keccak, ecrecover, addHexPrefix, pubToAddress} from 'ethereumjs-util';

// Convert MultiHash Block data to buffer
function mhDataToBuffer(data) {
    return Buffer.from(data.replace('\\x',''), 'hex');
}

/**
 * Returns miner address for PoA networks. Extract it from block extra field
 *
 * @param blockRlp
 */
 function extractMinerFromExtra(blockRlp) {
    const blockRlpBuf = mhDataToBuffer(blockRlp);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded = rlp.decode(blockRlpBuf)[0];
    console.log(2132131, decoded[12])
    const extra = decoded[12];
    // last 65 bytes are miner signature
    const sig = extra.slice(extra.length - 65);

    // convert hex signature to v, r, s format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const signature = fromRpcSig(sig);

    // to recovery miner address from signature we need to get block hash without this signature
    decoded[12] = extra.slice(0, extra.length - 65);
    const encodedBlock = rlp.encode(decoded);
    const blockHash = keccak(encodedBlock);
    console.log(blockHash, signature);
    const pub = ecrecover(blockHash, signature.v, signature.r, signature.s)
    const address = addHexPrefix(pubToAddress(pub).toString('hex'));

    return address;
}

// curl -X POST "http://127.0.0.1:8546" --header 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"debug_getBlockRlp","params":[10],"id":1}'
const blockRlp = "f902c8f90258a062875084ea67d5244085468a16c38ee113eb0173563da6dddf3788c81f99e379a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347940000000000000000000000000000000000000000a007ac2b35f37d75f065948cb94902c7e297a8ea37eb64917d53f0610f31134003a01cb3d6c2c127bb62b6bd58d981726ba39a18ce7ebbc4a040e0ef01aee897eed4a0056b23fbba480696b65fe5a59b8f2148a1299103c4f57df839233af2cf4ca2d2b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020a837b44778252088463518829b861d883010a17846765746888676f312e31382e35856c696e757800000000000000f6c529cf889ba47d7b4c457fdf6b0890ccfa520c2e844444fbc4c6f096e3f7626240d5ea3a7ce0fbb50e21603ec1e67c8b6b89c9a64aa1d6bc43cd68d93e494700a00000000000000000000000000000000000000000000000000000000000000000880000000000000000f86af86804843b9aca008301d8a894622fbe99b3a378fac736bf29d7e23b85e18816eb82d43180826095a0527c2b95f7cb8de0897d89b32fc722c865cfb886d9ce7cfde9a3f6eb69c9f85ca005b5f6b0d482787691191d91f0dbbd01ed2009609bbac248ef74fffce648b3bcc0";
console.log(extractMinerFromExtra(blockRlp))
// 0x4cdbd835fe18bd93cca39a262cff72dbac99e24f
