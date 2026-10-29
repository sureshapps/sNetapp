import {test} from 'node:test';import assert from 'node:assert/strict';import {validHost} from './server.mjs';
test('network command targets cannot contain arguments or shell syntax',()=>{for(const h of ['example.com','1.1.1.1','localhost'])assert.equal(validHost(h),true);for(const h of ['-n','a;whoami','a & dir','a b','https://example.com','a..b',''])assert.equal(validHost(h),false)});
