import { clear, log } from "console"
import { readFile, writeFile } from "fs/promises"

const rand = (x,n) => Math.random() * (x-n) + n
const irand = (x,n) => Math.round(rand(x,n))
const choose = (a) => a[irand(0, a.length-1)]
const sleep = ms => new Promise(r => setTimeout(r, ms))

const weightedRandomChooser = class {
    cumulative = []
    choiceKeys = []
    sum = 0

    constructor(weightedChoices = {}){
        this.batchAdd(weightedChoices)
    }
    add(key, weight = 1){
        weight = Math.abs(Number(weight)||1)
        this.sum += weight
        this.choiceKeys.push(key)
        this.cumulative.push(this.sum)
    }
    reset(){
        this.sum = 0
        this.cumulative = []
        this.choiceKeys = []
    }
    batchAdd(weightedChoices){
        for(let [key, weight] of Object.entries(weightedChoices))
            this.add(key, weight)
    }
    choose(){
        if(this.choiceKeys.length == 0)
            return null

        let randomPoint = Math.random() * this.sum
        let bsearchRange = [0, this.choiceKeys.length-1]

        while(bsearchRange[0] < bsearchRange[1]){
            let mid = Math.floor((bsearchRange[0]+bsearchRange[1])/2)
            if(randomPoint > this.cumulative[mid])
                bsearchRange[0] = mid+1
            else
                bsearchRange[1] = mid
        }
        return this.choiceKeys[bsearchRange[0]]
    }
}
const weightedRandomChoose = function(weightedChoices){ 
    // I'm avoiding to repeat code here. That's why I'm using the class aproach every time I invoke this fn.
    let chooser = new weightedRandomChooser(weightedChoices)
    return chooser.choose()
}
// clear()

let model = JSON.parse(await readFile("./letter-chain.json", "utf-8"))
let iters = 0
let startingChoices = Object.entries(model).reduce((p,v)=>({...p, [v[0]]: v[1].starts}), {})
let startingChooser = new weightedRandomChooser(startingChoices)

for(let j = 0; j < 40; j++){
    let word
    
    // do {
        let wordParts = [startingChooser.choose()]
        for(let i = 0; i < irand(2,15); i++){
            let prev = wordParts[wordParts.length-1]
            let next
            let current = model[prev.slice(-1)[0]]
            let nextChoices = i == 0 ? current.second : current.next 
            next = weightedRandomChoose(nextChoices) 
            //No way to optimize this with the class-driven approach: 702 (26²+26) possibilities considering bigrams...

            wordParts.push(next)
        }
        
        word = wordParts.join("")
        if(++iters > 100){
            iters = 0
            await sleep(50)
        }
    // } while(!word.endsWith("ing")) //Enable this if you wish to generate words with specific suffixes/prefixes
	
    log(word)
}
