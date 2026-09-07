let a = `sfdafafasf\n\t
${'${}'}sdafaf
dasfdasfas`
let b = /^[\s\S\n.]{0,120}$/.test(a)
console.log(a,b)