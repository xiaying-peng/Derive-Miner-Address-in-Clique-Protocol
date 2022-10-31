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
    const extra = decoded[12];
    console.log("extra", extra)

    // last 65 bytes are miner signature
    const sig = extra.slice(extra.length - 65);
    console.log("sig", sig)

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
const blockRlp = "f902c8f90258a0060fbc3e0470637c9d991482568987de1e28b79ff1cfb6ecfba5459da76d921ba01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347940000000000000000000000000000000000000000a03e03cda354c6375d571169e0a3d2f907f8493e0a14ac0ff9f29a4c5d710b2f3da014758b71750670d3294e1025bb4bb0c67262071e84ede657e6af6f88d2b5a661a0056b23fbba480696b65fe5a59b8f2148a1299103c4f57df839233af2cf4ca2d2b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020c837b821e825208846351883fb861d883010a17846765746888676f312e31382e35856c696e757800000000000000de728f491aeff483587afc32b395eda6939ce969d6a3371975719516e95d8a7e554355dfbe817a915db4b75d4c7add3cb23709644b28d427748fe3b1d767366e01a00000000000000000000000000000000000000000000000000000000000000000880000000000000000f86af86805843b9aca008301d8a894622fbe99b3a378fac736bf29d7e23b85e18816eb82d43180826095a0c4bf15e86318b6ad348ea1db8cb8ee5c6d60c9d500fc0d42ebf8484fcc57f0fda0730d866f062420a71ddc0870bba9e594b4c7e84f7664a9bb69671e725ad8af4ac0";
console.log(extractMinerFromExtra(blockRlp))
// 0x4cdbd835fe18bd93cca39a262cff72dbac99e24f
