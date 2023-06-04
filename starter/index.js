const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('../modules/replaceTemplate');
const slugify = require('slugify');

//templates 

const templateOverview = fs.readFileSync('starter/templates/template-overview.html', 'utf-8');
const templateCard = fs.readFileSync('starter/templates/template-card.html', 'utf-8');
const templateProduct = fs.readFileSync('starter/templates/template-product.html', 'utf-8');

const data =  fs.readFileSync('starter/dev-data/data.json', 'utf-8');
const productData = JSON.parse(data);
const slugs = productData.map(element=>slugify(element.productName,{lower: true}));

//server
const server = http.createServer((req, res)=>{
    const {query, pathname} = url.parse(req.url, true);

    //Overview page
    if(pathname==='/'  || pathname==='/overview')
    {
        res.writeHead(200,{'Content-type': 'text/html'});
        const cardsHtml = productData.map(element => replaceTemplate(templateCard, element)).join('');
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }

    //Product page
    else if (pathname ==='/product')
    {
        res.writeHead(200,{'Content-type': 'text/html'});
        const product = productData[query.id];
        output = replaceTemplate(templateProduct, product);
        res.end(output);
    }
    //Api page
    else if (pathname === '/api')
    {
        res.writeHead(200,{'Content-type': 'application/json'});
        res.end(data);
    }    
    //Not Found
    else
    {
        res.writeHead(404);
        res.end("Page Not Found");
    }
 
});

server.listen(8000,'127.0.0.1', () =>{
    console.log('[+] Listening on port 8000');
});


