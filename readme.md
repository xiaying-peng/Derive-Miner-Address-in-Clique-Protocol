## Drieve Miner Address in Clique Protocol

In ethereum Clique POA protocol, header fields are repurposed for signing and voting.

The most obvious field that currently is used solely as fun metadata is the 32 byte extra-data section in block headers. Miners usually place their client and version in there, but some fill it with alternative "messages". 

The protocol would extend this field to with 65 bytes with the purpose of a secp256k1 miner signature. This would allow anyone obtaining a block to verify it against a list of authorized signers. It also makes the miner section in block headers obsolete (since the address can be derived from the signature).

In order to fetch miner address, we have to do the following 2 steps:
1. Get block data in RLP format
2. run script to derive the address from RLP

### How
```
curl -X POST "http://127.0.0.1:8546" --header 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"debug_getBlockRlp","params":[10],"id":1}'
```

```
node run.js
```


