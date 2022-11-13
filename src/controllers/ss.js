function freq(arr){
   // let arr = ["a","b","c","a","b","b","b","b","a"]
 let obj ={}
// let map =new Map()
 for(let i=0;i<arr.length;i++){
    obj[arr[i]]= (obj[arr[i]]||0)+1
   // console.log(obj)
 }
 return obj
}

//console.log(freq(["a","b","c","a","b","b","b","b","a"]))
let arr = ["a","b","c","a","b","b","b","b","a"]
 let newArr = arr.filter((x)=>{
   if(x=="a"|| x=="b"){
    return x
   }
}) 
/* function isPresent(x){
    if(x=="a"){
        return x
    }

}
const newArr = arr.filter(isPresent) */
console.log(newArr)


const names = ["Alice", "Bob", "Tiff", "Bruce", "Alice"];

const countedNames = names.reduce((allNames,n) => {
//const currCount = allNames[n] ?? 0;
  let cur=0;
  if(allNames[n]){
    cur=allNames[n]
  }else{
    cur=0
  }
  return {
    ...allNames,
    [n]: cur + 1,
  };
}, {});

console.log(countedNames)

