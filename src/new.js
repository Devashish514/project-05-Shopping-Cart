
//         data.items = []
//         if (data.productId && data.quantity) {
//             const productId = data.productId.split(",");
//             const quantityArr = data.quantity.split(",");
//             let totalPrice = 0
//             for (let i = 0; i < productId.length; i++) {
//                 if (!isValidObjectId(productId[i])) {
//                     return res.status(400).send({ status: false, message: "Invalid ProductId input..!!" });
//                 }
//                 if (isNaN(Number(quantityArr[i]))) {
//                     return res.status(400).send({ status: false, message: "Invalid Quantity Input..!!" });
//                 }
//                 const findProduct = await productModel.findById(productId[i]).select({ price: 1, _id: 0 });
//                 totalPrice = totalPrice + findProduct.price * quantityArr[i]
//                 data.items.push({ productId: productId[i], quantity: quantityArr[i] });
//             }
//             let findUser = await cartModel.findOne({ userId: data.userId });
//             if (!findUser) {
//                 data.totalPrice = Math.floor(totalPrice);
//                 data.totalItems = data.items.length;

//                 let createData = await cartModel.create(data);
//                 res.status(201).send({ status: true, message: "cart Successfully Created..", data: createData });
//             } else {
//                 const userItems = findUser.items;
//                 let totalPrice = findUser.totalPrice;
//                 const count = [];
//                 //Validating Duplicate Items In cart..
//                 const checkProducts = function (arr1, arr2) {
//                     for (let i = 0; i < arr1.length; i++) {
//                         for (let j = 0; j < arr1.length; j++) {
//                             if (arr1[i].productId == arr2[j]) {
//                                 count.push(String(i));
//                             }
//                         }
//                     }
//                 }
//                 checkProducts(userItems, productId);
//                 if (count.length != 0) {
//                     let obj = {};    //{ '0': 1, '1': 2 }
//                     count.forEach(current => {
//                         if (!obj[current]) {
//                             obj[current] = 1;
//                         } else {
//                             obj[current]++;
//                         }
//                     });
//                     let objArr = Object.keys(obj);
//                     let objValArr = Object.values(obj);
//                     for (let i = 0; i < objArr.length; i++) {
//                         let index = Number(objArr[i]);
//                         userItems[index].quantity += objValArr[index];
//                     }
//                 }

//                 for (let i = 0; i < productId.length; i++) {
//                     if (!isValidObjectId(productId[i])) {
//                         return res.status(400).send({ status: false, message: "Invalid ProductId input..!!" });
//                     }
//                     if (isNaN(Number(quantityArr[i]))) {
//                         return res.status(400).send({ status: false, message: "Invalid Quantity Input..!!" });
//                     }
//                     const findProduct = await productModel.findById(productId[i]).select({ price: 1, _id: 0 });
//                     totalPrice = totalPrice + findProduct.price * quantityArr[i];
//                     if(count.length==0){
//                     userItems.push({ productId: productId[i], quantity: quantityArr[i] });
//                     }
//                 }
//                 findUser.totalPrice = totalPrice;
//                 findUser.totalItems = userItems.length;
//                 findUser.save();
//                 return res.status(200).send({ status: true, message: "Cart Updated..", data: findUser });

//             }
//         }

//         else {
//             return res.status(400).send({ status: false, message: "Missing items..!!" });  //need to change --> if items not present in body , add field items with a message.
//         }

//     }
//     // console.log(data)
// }