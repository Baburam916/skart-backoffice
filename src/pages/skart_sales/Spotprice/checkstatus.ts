export const checkstatus=(status?:any)=>{
const statuslist = [
 
 2 ,
 3 ,
 4 ,
 5 ,
 6,
 8 ,
 9 ,
 10 ,
 11,
 12 ,
 13 ,
 15,

 
];
// console.log(statuslist.includes(Number(status)),"test",status,"status");
return (statuslist.includes(Number(status)))
}