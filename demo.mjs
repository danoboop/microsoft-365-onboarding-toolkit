import {buildPlan} from './plan.mjs';
const config={domain:'example.com',usageLocation:'US',workLocations:['Office','Remote','Hybrid'],profiles:[{role:'Engineer',department:'Engineering'},{role:'Coordinator',department:'Operations'}]};
const form=document.querySelector('#onboarding');
form.elements.role.addEventListener('change',()=>document.querySelector('#department').textContent=config.profiles.find(p=>p.role===form.elements.role.value).department);
form.addEventListener('submit',e=>{
 e.preventDefault();const status=document.querySelector('#status'),steps=document.querySelector('#steps');steps.replaceChildren();
 try{const plan=buildPlan(Object.fromEntries(new FormData(form)),config);status.textContent=`Preview: ${plan.userPrincipalName}. No account was created.`;
 for(const step of plan.steps){const li=document.createElement('li'),method=document.createElement('strong'),path=document.createElement('code'),note=document.createElement('p');method.textContent=step.method;path.textContent=step.path;note.textContent=step.note||'';li.append(method,path,note);steps.append(li)}
 document.querySelector('#json').textContent=JSON.stringify(plan,null,2);
 }catch(err){status.textContent=err.message;document.querySelector('#json').textContent='No request generated.'}
});
