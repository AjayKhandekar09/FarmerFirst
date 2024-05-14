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
async function addProduct(event) {
    event.preventDefault(); // Prevent default form submission
    if (!sessionStorage.getItem("userData")) {
        alert("Please log in first");
        return;
    }

    const productData = new FormData(event.target);
    const userData = (sessionStorage.getItem("userData"));
    console.log(userData);


    const formData = new FormData();
    formData.append('productName', productData.get('product_name'));
    formData.append('productQuantity', productData.get('product_quantity'));
    formData.append('productPrice', productData.get('product_price'));
    formData.append('productDescription', productData.get('product_description'));
    formData.append('productImage', productData.get('product_image'));
    formData.append('userData', userData);

    try {
        const response = await fetch("http://localhost:8000/api/user/add", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            console.log("Product added successfully!");
        } else {
            console.error("Failed to add product:", response.statusText);
        }
    } catch (error) {
        console.error("An error occurred while adding the product:", error);
    }
}


async function searchProduct(event) {
    event.preventDefault();
    const searchText = document.querySelector(".searchIcon");
    const queryProduct = searchText.value;
    console.log(queryProduct);
    const jsonData = {
        product : queryProduct
    }

    try {
        const response = await fetch("http://localhost:8000/api/user/buyProduct", {
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(jsonData)
        })

        if(response.ok) {
            const data = await response.json();
            const productInfo = data.productInfo;
            console.log(productInfo);
            var productSection = document.querySelector('.productSection'); // Corrected selector
            productSection.innerHTML = ''; // Clear previous products
            var productRow = document.createElement('div');
            productRow.classList.add('row');
            productInfo.forEach(function(product) { // Iterate over all products in productInfo
                var productHTML = `
                    <div class="col-lg-3 text-center">
                        <div class="card border-0 bg-light mb-2">
                            <div class="card-body">
                                <img src="${product.images}" alt="${product.name}" class="img-fluid">
                            </div>
                        </div>
                        <h6>${product.name}</h6>
                        <p>${product.pricePerProduct} Rs</p>
                        <p>farmer : ${product.farmer.username}</p>
                        <p>quantity : ${product.quantity}</p>
                    </div>
                `;
                productRow.innerHTML += productHTML;
            });
            productSection.appendChild(productRow); // Append the product row to the product section

        }
        else {
            alert(response.message)
        }
    } catch (error) {
        
    }
}

