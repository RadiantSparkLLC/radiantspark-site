import {build} from 'esbuild';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const source=`import React from 'react';
import {renderToString} from 'react-dom/server';
import App from './src/App.tsx';
globalThis.localStorage={getItem:()=>null,setItem:()=>{}};
for(const hash of ['global','usa','india','sparkdeals','brain','lifestyle']){
 globalThis.window={addEventListener:()=>{},removeEventListener:()=>{},location:{hash:'#'+hash,pathname:'/'}};
 const html=renderToString(<App/>);
 if(html.length<1000)throw Error(hash+' rendered empty');
 if(hash==='sparkdeals'&&!html.includes('Find your next great purchase'))throw Error('Missing merchant search');
 if(hash==='brain'&&!html.includes('Business task planner'))throw Error('Missing planner');
 if(hash==='lifestyle'&&html.includes('Valued Customer'))throw Error('Sample customer data leaked');
 console.log('PASS render',hash);
}`;
const result=await build({stdin:{contents:source,resolveDir:process.cwd(),loader:'tsx'},bundle:true,platform:'node',format:'cjs',loader:{'.jpg':'dataurl'},write:false});
const dir=mkdtempSync(join(tmpdir(),'radiant-routes-'));
try {const file=join(dir,'check.cjs');writeFileSync(file,result.outputFiles[0].contents);const run=spawnSync(process.execPath,[file],{stdio:'inherit'});if(run.status!==0)process.exitCode=run.status||1;}finally{rmSync(dir,{recursive:true,force:true});}
