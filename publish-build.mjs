import {cpSync,readdirSync} from 'node:fs';
for(const f of readdirSync('website/dist')) cpSync('website/dist/'+f,f,{recursive:true});
