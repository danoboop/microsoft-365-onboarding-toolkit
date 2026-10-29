import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {buildPlan} from './plan.mjs';
const config = JSON.parse(await readFile(new URL('./config.example.json',import.meta.url)));
const person = {firstName:'Alex',lastName:'Rivera',alias:'alex.rivera',role:'Engineer',workLocation:'Remote'};
test('creates a disabled-account preview without authentication or actual requests',()=>{
 const p=buildPlan(person,config); assert.equal(p.mode,'preview'); assert.equal(p.steps.length,2);
 assert.equal(p.steps[1].body.accountEnabled,false);assert.equal(p.steps[1].body.passwordProfile.password,'${GENERATE_AT_RUNTIME}');
 assert.equal(p.userPrincipalName,'alex.rivera@example.com');
});
test('rejects domain injection through alias',()=>assert.throws(()=>buildPlan({...person,alias:'alex@other.example'},config)));
test('rejects unknown roles and locations',()=>{
 assert.throws(()=>buildPlan({...person,role:'Administrator'},config));
 assert.throws(()=>buildPlan({...person,workLocation:'Unknown'},config));
});
test('rejects malformed manager and SKU identifiers',()=>{
 assert.throws(()=>buildPlan({...person,managerId:'../../users'},config));
 assert.throws(()=>buildPlan(person,{...config,profiles:[{...config.profiles[0],licenseSkuId:'not-a-guid'}]}));
});
test('optional manager and license calls are explicit and omit arbitrary endpoints',()=>{
 const id='00000000-0000-4000-8000-000000000001';
 const p=buildPlan({...person,managerId:id},{...config,profiles:[{...config.profiles[0],licenseSkuId:id}]});
 assert.equal(p.steps.length,4);assert.equal(p.steps[2].body['@odata.id'],`https://graph.microsoft.com/v1.0/users/${id}`);
 assert.equal(p.steps[3].body.addLicenses[0].skuId,id);
});
test('rejects missing names and control characters',()=>{
 assert.throws(()=>buildPlan({...person,firstName:''},config));assert.throws(()=>buildPlan({...person,lastName:'Rivera\nInjected'},config));
});
