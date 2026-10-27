import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/__qa'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(await readFile(resolve('tests/responsive.html')));return;}const file=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+sep))throw Error();res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(await readFile(file));}catch{res.writeHead(404);res.end('Tidak ditemukan');}}).listen(4173,'127.0.0.1',()=>console.log('ADMIRA: http://127.0.0.1:4173'));
