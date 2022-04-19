// // const validUrl=require("valid-url");

// // const url= "https://github.com/sabihak89/thorium/tre e/project/shopping-cart";
// // // console.log(validUrl.isUri(url))
// // if(validUrl.isUri(url)){
// //     console.log("yes it is")
// // }else{
// //     console.log("no it is not")
// // }

// // console.log("12345".split(""))

// // const { hash } = require('bcrypt');
// // const bcrypt = require('bcrypt');

// // const password = 'asdfgh123';
// // var hashedPassword;

// // // Encryption of the string password
// // bcrypt.genSalt(10, function (err, Salt) {

// //     // The bcrypt is used for encrypting password.
// //     bcrypt.hash(password, Salt, function (err, hash) {

// //         if (err) {
// //             return console.log('Cannot encrypt');
// //         }

// //         hashedPassword = hash;
// //         console.log(hash);

// //         bcrypt.compare(password, hashedPassword, 
// //             async function (err, isMatch) {

// //             // Comparing the original password to
// //             // encrypted password   
// //             if (isMatch) {
// //                 console.log('Encrypted password is: ', password);
// //                 console.log('Decrypted password is: ', hashedPassword);
// //             }

// //             if (!isMatch) {

// //                 // If password doesn't match the following
// //                 // message will be sent
// //                 console.log(hashedPassword + ' is not encryption of ' 
// //                 + password);
// //             }
// //         })
// //     })
// // })


// // Encrypting password using bcrypt
// // const pass = "abcdefght1324"
// // var hashedPassword;
// // bcrypt.genSalt(15, function (err, salt) {
// //     bcrypt.hash(pass, salt, function (err, hash) {
// //         if (err) {
// //             return console.log("cnnot encrypt")
// //         }
// //         hashedPassword = hash
// //         console.log(hashedPassword)
// //         async function checkpass(password) {
// //             const match = await bcrypt.compare(password, hashedPassword)
// //             if (match) {
// //                 console.log(match)
// //             }
// //         }
// //         checkpass(pass)
// //     })
// // })
// // const encrypt= hashedPassword;
// // console.log(encrypt,pass)

// // let name= 123456;
// // // console.log(name.split(" ").join(""))
// // console.log(name.split(" ").join(""))

// // console.log(typeof -1)

// // console.log(Number("02.3"))

// // const num=123
// // console.log(typeof true)

// // let a= "true";
// // let b = "false";
// // let c = "S,M,XL,X"
// // // console.log(Boolean(b))
// // console.log(c.split(","))
// let size="M"
// // const checkSize = (arr) => {
// //     for (let i=0;i<arr.length-1;i++) {
// //         // if (size==element) {
// //         //     return true     // doesn't match
// //         // }else{
// //         //     return false
// //         // }
// //         // console.log(arr[i])
// //         console.log(arr.length)
// //     }
// // }

// function checkSize(arr){
//     for (let i=0;i<arr.length-1;i++) {
//         console.log(i)
//     }
// }
// console.log(checkSize(["S","XS","L","M","XXL","XL"]))
// let size="qa"
// let arr=["S","XS","L","M","XXL","XL"]
// const check = arr.find(element => element==size)
// const check2 = arr.findIndex(element => element==size)
// console.log(Boolean(check));
// console.log(Boolean(check2));

// console.log(Boolean([]))

// let a= "S"
// console.log(a.split(","))

// function matchArrays(base, toSearch) {
//     var returnArray = [];
//     for (var i = 0; i < toSearch.length; i++) {
//         if (base.indexOf(toSearch[i]) !== -1) 
//         returnArray.push(toSearch[i]);
//     }
//     return returnArray;
// }

// let match= matchArrays(["S","XS","L","M","XXL","XL"],["S","XL","A"]);
// console.log(match)


// console.log(Boolean(-1));

// var items=[{
//     productId: {
//         type: "objectId",
//         ref: "productModel",
//         required: "true"
//     },
//     quantity: {
//         type: "Number",
//         required: "true",
//     }
// }];

// for(var obj of items){
//     // console.log(obj.productId)
//     if(!obj.productId || !obj.quantity){
//         console.log("yes");
//     }else{
//         console.log("No")
//     }
// // }

// // let product= "{product:'lki'}"
// // let parse=JSON.parse(product)
// // console.log(parse)

// let items = [
//     { productId: '6257100ba5761e1627726c09', quantity: 2 },
//     { productId: '6257353da4d0ab0a5215f195', quantity: 3 },
//     { productId: '6257353da4d0ab0a5215f1958', quantity: 7 }
// ];
// let product = ["2", "6257353da4d0ab0a5215f195", "6257100ba5761e1627726c09", "6257353da4d0ab0a5215f195"];

// let count = [];
// for (let i = 0; i < items.length; i++) {
//     for (let j = 0; j < items.length + 1; j++) {
//         if (items[i].productId == product[j]) {
//             // count.push(String(i))
//             items.splice(items[i],1);
//         }
//     }
// }
// console.log(count, items, product)

// // let count = ["0","1","1"];
// let obj = {};
// count.forEach(cur => {
//     if (!obj[cur]) {
//         obj[cur] = 1
//     } else {
//         obj[cur]++;
//     }
// });
// console.log(obj)
// let objArr = Object.keys(obj);
// let objValArr = Object.values(obj);
// for (let i = 0; i < objArr.length; i++) {
//     let index = Number(objArr[i]);
//     items[index].quantity += objValArr[index];
// }
// console.log(items)

// // for(let k=0;k<count.length;k++){
// //     items[k].quantity +=1;
// // }
// console.log(items,count)

// let str= "abcde";
// for(let i in str){
//     console.log(`loop is at index ${i}`)
// }

// for(var ele of str){
//     console.log(`ele is ${ele}`)
// }