import { clear, log } from "console"
import { readFile, writeFile } from "fs/promises"

const rand = (x,n) => Math.random() * (x-n) + n
const irand = (x,n) => Math.round(rand(x,n))
const choose = (a) => a[irand(0, a.length-1)]
const sleep = ms => new Promise(r => setTimeout(r, ms))

clear()

let model = JSON.parse(await readFile("./letter-chain.json", "utf-8"))
let iters = 0

for(let j = 0; j < 20; j++){
    let word
    
//     do {
        let wordParts = [choose(Object.keys(model))]
        for(let i = 0; i < irand(2,15); i++){
            let prev = wordParts[wordParts.length-1]
            let next

            if(i == 0)
                next = choose(Object.keys(model[prev.slice(-1)[0]].second).slice(0,100))
            else
                next = choose(Object.keys(model[prev.slice(-1)[0]].next).slice(0,100))
            wordParts.push(next)
        }
        
        word = wordParts.join("")
        if(++iters > 2000){
            iters = 0
            await sleep(50)
        }

//     } while(!word.endsWith("ing")) //Enable this if you wish to generate words with specific suffixes/prefixes
	
    log(word)
}
