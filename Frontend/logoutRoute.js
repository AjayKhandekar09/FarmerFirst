// import { userData } from "./loginUser.js"
// console.log("HELLO");

const addProduct = async function(event) {
    console.log("HELLO");

    // if(!userData) {
    //     // return
    // }
    const productData = new FormData(event.target)
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
    }, {});

    // Access specific cookie
    console.log(cookies);
    // console.log(productData);
    alert("entered")
    const userDataCredentials = {
        userData : userData,
        productName : productData.get("product_name"),
        productQuantity : productData.get("product_quantity"),
        productPrice : productData.get("product_price"),
        productImage : productData.get("product_image"),
        productDescription : productData.get("product_description")
    }
    console.log();
    // try {
    //     await fetch("http://localhost:8000/api/ user/addProduct", {
    //         method : "POST",
    //         headers : {
    //             "Content-Type" : "application/json"
    //         },
    //         body : JSON.stringify(userDataCredentials)

    //     })
    // } catch (error) {
    //     console.log(error);
    // }
}