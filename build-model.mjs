import { clear, log } from "console"
import { readFile, writeFile } from "fs/promises"
clear()
process.stdout.write("\x1b[H\x1b[2J\x1b[3J")
let dic = (await readFile("english_words_alpha.txt", "utf-8"))
    .trim()
    .split("\r\n")
    .filter(v => v.length > 2)
    .map(v => v.toLocaleLowerCase())

let chain = {}
for(let word of dic){
    for(let i = 0; i < word.length-1; i++){
        let curr = word[i]
        let next = word.substr(i+1,2)//word[i+1]
        chain[curr] = chain[curr]||{}
        if(i == 0){
            chain[curr].starts = (chain[curr].starts||0)+1
            chain[curr].second = chain[curr].second||{}
            chain[curr].second[next] = (chain[curr].second[next]||0)+1
        } else {
            chain[curr].next = chain[curr].next||{}
            chain[curr].next[next] = (chain[curr].next[next]||0)+1
        }
    }
}
let model = (
    Object.entries(chain)
    .sort((a,b)=>b[1].starts-a[1].starts)
    .map(x=>[x[0], {
        ...x[1], 
        next: Object.entries(x[1].next)
            .sort((a,b)=>b[1]-a[1])
            .reduce((p,v)=>({...p, [v[0]]: v[1]}), {}),
        second: Object.entries(x[1].second)
            .sort((a,b)=>b[1]-a[1])
            .reduce((p,v)=>({...p, [v[0]]: v[1]}), {})

    }])
    .reduce((p,v)=>({...p, [v[0]]: v[1]}), {})

)

await writeFile("./letter-chain.json", JSON.stringify(model, null, 4)) 
