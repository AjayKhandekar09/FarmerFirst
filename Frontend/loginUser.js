let userData




const loginUser = async (event) => {
    event.preventDefault()
    console.log("KKKKK");
    const loginData = new FormData(event.target)
    // console.log(loginData.get("password"))
    const loginJson = {
        username : loginData.get("username"),
        password : loginData.get("password")
    }
    // console.log(loginResponse)
    console.log(typeof loginJson);

    try {
        const loginResponse = await fetch("http://localhost:8000/api/user/login", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(loginJson)
        })
        
        if(loginResponse.ok) {
            // alert(`oops!!!`)
            userData = await loginResponse.json();

            sessionStorage.setItem('userData', JSON.stringify(userData));

            console.log(userData);

            console.log("logined successfully");
            console.log(document.cookie)

            alert("login successfull")
            
            setTimeout(() => {
                window.location.href = "/homePage.html";
            }, 100);         }
        else {

            const jsonRes = await loginResponse.json()
            
                alert(jsonRes.message)
            
        }
        
    } catch (error) {
        console.log(error);
    }
}

const logoutUser = async function(event) {

    try {
        console.log(document.cookie)
        const userData1 = JSON.parse(sessionStorage
.getItem("userData"))
        console.log(typeof userData1);

        if (!userData1) {
            console.log("User is not logged in.");
            // return;
        }

        const logoutResponse = await fetch("http://localhost:8000/api/user/logout" , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(userData1)
        })
        if(!logoutResponse) {
            alert("something went wrong")
        }

        if(logoutResponse.ok) {
            sessionStorage.clear('userData')
            window.location.href = "/index1.html"
        }
        else {
            const jsonRes = await logoutResponse.json()
            alert(jsonRes.message)
        }
   
    } catch (error) {
        console.log(error)
    }
}

// const addProduct = async function(event) {
//     console.log(userData);

//     if(!userData) {
//         // return
//     }
//     const productData = new FormData(event.target)
//     // console.log(productData);
//     const userDataCredentials = {
//         userData : userData,
//         productName : productData.get("product_name"),
//         productQuantity : productData.get("product_quantity"),
//         productPrice : productData.get("product_price"),
//         productImage : productData.get("product_image"),
//         productDescription : productData.get("product_description")
//     }
//     try {
//         await fetch("http://localhost:8000/api/user/addProduct", {
//             method : "POST",
//             headers : {
//                 "Content-Type" : "application/json"
//             },
//             body : JSON.stringify(userDataCredentials)

//         })
//     } catch (error) {
//         console.log(error);
//     }
// }