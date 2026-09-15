const fs=require('fs');
global.PREP={data:{}};
const files=process.argv.slice(2);
for(const f of files) eval(fs.readFileSync(f,'utf8'));
let total=0,bad=0;const ids=new Set();
for(const [k,arr] of Object.entries(PREP.data)){
  if(!Array.isArray(arr)) continue;
  const by={};
  arr.forEach(x=>{
    total++;
    if(!x.id){console.log('!! manca id in',k);bad++;return;}
    if(ids.has(x.id)){console.log('!! id duplicato:',x.id);bad++;}
    ids.add(x.id);
    if(!x.lang){console.log('!! manca lang:',x.id);bad++;}
    if(!x.topic){console.log('!! manca topic:',x.id);bad++;}
    by[x.lang]=(by[x.lang]||0)+1;
  });
  console.log(k.padEnd(10),String(arr.length).padStart(4),' ',JSON.stringify(by));
}
console.log('---');
console.log('TOTALE ITEM:',total, bad?('PROBLEMI: '+bad):'ok');
