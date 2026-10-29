const test=require('node:test'); const assert=require('node:assert/strict'); const {validateStudent,analyticsReady}=require('../src/validation');
const valid={student_code:'TEST_001',age:21,gender:'Prefer not to say',city:'Fargo',country:'US',education_level:'Undergraduate'};
test('valid registration',()=>{const result=validateStudent(valid);assert.equal(result.error,undefined);assert.equal(result.values.length,9)});
test('reject duplicate-related malformed code',()=>assert.ok(validateStudent({...valid,student_code:'bad code'}).error));
test('reject missing age',()=>assert.ok(validateStudent({...valid,age:''}).error));
test('reject extreme age',()=>assert.ok(validateStudent({...valid,age:121}).error));
test('reject overly long input, without silent truncation',()=>assert.ok(validateStudent({...valid,city:'x'.repeat(101)}).error));
test('require description for self-described gender',()=>assert.ok(validateStudent({...valid,gender:'Self-describe'}).error));
test('analytics only unlocks after ten',()=>{assert.equal(analyticsReady(0),false);assert.equal(analyticsReady(10),false);assert.equal(analyticsReady(11),true)});
