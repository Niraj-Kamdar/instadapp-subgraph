const fs = require("fs")
const nunjucks = require('nunjucks');

if(process.argv.length < 3){
    console.log("Insuffficient Arguments!");
    return -1;
}

const config = JSON.parse(fs.readFileSync(`configs/${process.argv[2]}.json`))

nunjucks.render("subgraph.template.yaml", config, (err, res) => {
    fs.writeFileSync("subgraph.yaml", res);
})

nunjucks.render("src/config.template.ts", config, (err, res) => {
    fs.writeFileSync("src/config.ts", res);
})