const genders = new Set(['Female','Male','Non-binary','Prefer not to say','Self-describe']);
const levels = new Set(['High school','Undergraduate','Graduate','Other']);
function validateStudent(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {error:'Invalid registration'};
  const required = ['student_code','gender','city','country','education_level'];
  for (const key of required) if (typeof body[key] !== 'string' || !body[key].trim()) return {error:'Missing '+key};
  const optional = ['gender_description','state_region','field_of_study'];
  for (const key of optional) if (body[key] != null && typeof body[key] !== 'string') return {error:'Invalid '+key};
  const limits = {student_code:40,gender:30,city:100,country:100,education_level:30,gender_description:100,state_region:100,field_of_study:100};
  for (const [key,max] of Object.entries(limits)) if (typeof body[key]==='string' && body[key].trim().length>max) return {error:key+' is too long'};
  const age = Number(body.age);
  if (body.age===null || body.age===undefined || body.age==='' || !Number.isInteger(age) || age<13 || age>120) return {error:'Age must be an integer from 13 to 120'};
  const code=body.student_code.trim(), gender=body.gender.trim(),education=body.education_level.trim();
  if (!/^[A-Za-z0-9_-]{3,40}$/.test(code)) return {error:'Invalid student code'};
  if (!genders.has(gender) || !levels.has(education)) return {error:'Invalid gender or education level'};
  if (gender==='Self-describe' && !body.gender_description?.trim()) return {error:'Please enter gender description'};
  const value=(key)=>typeof body[key]==='string' ? body[key].trim() : '';
  return {values:[code,age,gender,gender==='Self-describe'?value('gender_description'):null,value('city'),value('state_region')||null,value('country'),education,value('field_of_study')||null]};
}
function analyticsReady(total){return Number(total)>10;}
module.exports={validateStudent,analyticsReady};
