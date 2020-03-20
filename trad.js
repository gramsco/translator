// this aims at translating python to js... let's see
// I'm thinking of using it with:
// https://www.npmjs.com/package/react-syntax-highlighter

let fs = require('fs')
let path = require('path')
let js = require('./languages/js')
let pyt = require('./languages/pyt')

let file_arg = process.argv[2]

let file = fs.readFileSync(path.join(__dirname, file_arg), "utf-8")

function analysis(file){

    let lines = file.split('\n')
    let languages = [
        {
            name:"JavaScript",
            src:js,
            score:0
        },
        {
            name:"Python",
            src:pyt,
            score:0,
        }
    ]
    let unknown = {name:"unknown", src:null, score:0}
    lines.forEach(l => {
        if (l.length > 100) return
        let foundOne = false
        languages.forEach((language,index) => {
            if (isInLanguage(l, language.src)) {
                foundOne = true
                languages[index].score ++
            }
        })
        if (!foundOne) unknown.score++
    })
    return bestScore([...languages, unknown])
}


function isInLanguage(line, src){
  
    for (let i = 0 ; i < src.length ; i ++){
        if (line.includes(src[i])) return true
    }
    return false
}

function bestScore(scores){
    let total = scores.map(e => e.score).reduce((a,b) => a+b, 0)
    let sorted = scores.sort((a,b) => b.score - a.score).map(e => ({name:e.name, score:e.score, percentage:Math.floor((e.score/total)*100)}))
    return {sorted, best:sorted[0]}
}

let {best, sorted} = analysis(file)
console.log(sorted)
// console.log(`This file is probably a ${best.name} file (${best.percentage} %)`)