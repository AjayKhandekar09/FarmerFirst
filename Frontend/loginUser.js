let userData,cartProducts,viewProducts

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
    // console.log(typeof loginJson);

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
                console.log("Hello");
                window.location.href = "./homePage.html";
            }, 100);         }
        else {

            const jsonRes = await loginResponse.json()
            
                alert(jsonRes.message)
            
        }
        
    } catch (error) {
        alert(error)
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
            window.location.href = "./index1.html"
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

    // Check if user is logged in
    if (!sessionStorage.getItem("userData")) {
        alert("Please log in first");
        return;
    }

    // Retrieve user data from sessionStorage
    const userData = JSON.parse(sessionStorage.getItem("userData"));

    // Construct FormData object for product data
    const productData = new FormData(event.target);
    const formData = new FormData();
    formData.append('productName', productData.get('product_name'));
    formData.append('productQuantity', productData.get('product_quantity'));
    formData.append('productPrice', productData.get('product_price'));
    formData.append('productDescription', productData.get('product_description'));
    formData.append('productImage', productData.get('product_image'));
    formData.append('quantityType', productData.get('quantityType'));
    formData.append('userData', JSON.stringify(userData)); // Include user data in FormData

    // Set timeout duration in milliseconds (e.g., 30 seconds)
    // const timeoutDuration = 30000; // 30 seconds

    // // Create AbortController instance
    // const controller = new AbortController();
    // const signal = controller.signal;

    try {
    //     const timeoutId = setTimeout(() => {
    //         controller.abort(); // Abort fetch request on timeout
    //         console.log('Fetch request timed out');
    //         alert('Request timed out. Please try again.');
    //     }, timeoutDuration);

        const response = await fetch("http://localhost:8000/api/user/add", {
            method: "POST",
            body: formData,
            // signal: signal // Pass signal to AbortController
        });
// 
        // clearTimeout(timeoutId); // Clear timeout if request completes before timeout

        // Pause or wait for 3 seconds
        // await new Promise(resolve => setTimeout(resolve, 30000));

        if (response.ok) {
            const responseData = await response.json();
            alert("Product added successfully!");
            console.log("Product added successfully:", responseData);
        } else {
            const errorData = await response.json(); // Parse response body for error details
            alert(`Failed to add product: ${errorData.message}`);
            console.error("Failed to add product:", errorData);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        // alert("An error occurred while adding the product");
    }
}

async function searchProduct(event) {
    event.preventDefault();
    const searchText = document.querySelector(".searchIcon");
    const queryProduct = searchText.value;
    console.log(queryProduct);
    const jsonData = {
        product: queryProduct
    }

    try {
        const response = await fetch("http://localhost:8000/api/user/searchProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonData)
        })

        if (response.ok) {
            const data = await response.json();
            const productInfo = data.productInfo;
            console.log(productInfo);
            var productSection = document.querySelector('.productSection');
            productSection.innerHTML = ''; // Clear previous products
            var productRow = document.createElement('div');
            productRow.classList.add('row');
            const i = 0;
            
            productInfo.forEach(function (product) {
                var qt
                if(product.quantityType === 0) {
                    qt = "Kg"
                }
                else {
                    qt = "dozon"
                }
                // let name = 
                var productHTML = `
<div class="col-lg-3 text-center">
    <div class="card border-0 bg-light mb-2">
        <div class="card-body">
            <img src="${product.images}" alt="${product.name}" class="img-fluid image${i}">
        </div>
    </div>
    <h6 class="name${i}">${product.name}</h6>
    <!-- Reduce width of quantity input -->
    <input type="number" class="quantityInput${i} form-control mb-2" placeholder='Quantity in ${qt}' style="width: 10rem; margin-left:6rem">
    <h6 style="display: none" class="id">${product._id}</h6>
    <h6 style="display: none" class="farmer_id">${product.farmer._id}</h6>
    <h6 style="display: none" class="quantityType${i}">${product.quantityType}</h6>
    <p class="price${i}">&#8377;${product.pricePerProduct}</p>
    <p class="productQuantity${i}">Available (in ${qt}s) ${product.quantity}</p>
    <p class="farmer${i}"><span>Farmer: </span>${product.farmer.username}</p>
    <div class="d-inline-block">
        <button class="btn btn-primary rounded buy-btn me-2" id="submitbtn${i}" onclick="addToCart(event)">Add to Cart</button>
        <button class="btn btn-primary rounded view-btn" class="viewbtn${i}" id="viewbtn${i}" onclick="viewProduct(event)">View Product</button>
    </div>
</div>




            `;
                productRow.innerHTML += productHTML;
            });
            productSection.appendChild(productRow); // Append the product row to the product section

            // Attach event listener to buy buttons
            // document.querySelectorAll('.buy-btn').forEach(button => {
            //     button.addEventListener('click', buyProduct);
            // });

        } else {
            alert(response.message)
        }
    } catch (error) {

    }
}

async function buyProduct(event) {
    try {
        // const btn = event.target;

        const btn = event.target;
        const btnId = btn.id.slice(9);
        console.log("Button ID:", btnId);

        const productDiv = btn.closest('.col-lg-3');
        const _id = productDiv.querySelector('.id').innerText;
        const name = productDiv.querySelector(`.name${btnId}`).innerText;
        const quantity = productDiv.querySelector(`.quantityInput${btnId}`).value;
        console.log(quantity);
        const price = (productDiv.querySelector(`.price${btnId}`).innerText).slice(1);
        const farmer = productDiv.querySelector(`.farmer${btnId}`).innerText.slice(9);
        // const availableQuantity = 
        const userData = sessionStorage.getItem("userData");

        const prodData = {
            name,
            quantity,
            price,
            farmer,
            _id,
            userData
        };
        console.log(prodData);
        const response = await fetch("http://localhost:8000/api/user/buyProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prodData)
        });

        const responseData = await response.json();

        if (response.ok) {
            alert(responseData.message);
        } else {
            alert(responseData.message);
        }

    } catch (error) {
        console.log(error);
    }
}

function extractNumber(str) {
    // Regular expression to match one or more digits
    let match = str.match(/\d+/);
    // If a match is found, return it as an integer
    return match ? parseInt(match[0], 10) : null;
}

async function addToCart(event) {
    try {
        // const btn = event.target;

        const btn = event.target;
        const btnId = btn.id.slice(9);
        console.log("Button ID:", btnId);

        const productDiv = btn.closest('.col-lg-3');
        const _id = productDiv.querySelector('.id').innerText;
        const name = productDiv.querySelector(`.name${btnId}`).innerText;
        const quantity = productDiv.querySelector(`.quantityInput${btnId}`).value;
        console.log(`Quantity: ${quantity}`);
        const price = (productDiv.querySelector(`.price${btnId}`).innerText).slice(1);
        const farmer = productDiv.querySelector(`.farmer${btnId}`).innerText.slice(8);
        console.log(productDiv.querySelector(`.farmer${btnId}`).innerText);
        const images = productDiv.querySelector(`.image${btnId}`).src;
        const quantityType = productDiv.querySelector(`.quantityType${btnId}`).innerText;
        console.log(quantityType+"heloo");
        const availableQuantity = productDiv.querySelector(`.productQuantity${btnId}`).textContent

        const available = extractNumber(availableQuantity)
        console.log(available);
        // alert(farmer)

        // Available (in Kgs)
        // if(quantityType === "Kg") {
        //     qt = 0;
        // }
        // else {
        //     qt = 1;
        // }
        console.log(quantityType);
        console.log(quantity);

        if(quantity === '') {
            alert("Enter quantity of product")
            return
        }
        const userData = sessionStorage.getItem("userData");
        console.log(parseInt(quantity) );

        if(parseInt(quantity) <= 0 || parseInt(quantity) > available ) {
            alert("Enter valid quantity")
            return
        }
        console.log(userData);
        const prodData = {
            name,
            quantity,
            price,
            farmer,
            _id,
            userData,
            images,
            quantityType
        };
        try {
            const response = await fetch("http://localhost:8000/api/user/addToCart", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(prodData)

            })

            const responseData  = response.json();

            if(response.ok) {
                alert("added successfully")
                productDiv.style.display = "none";
            }
            
        } catch (error) {
            console.log(error);
        }

        

    } catch (error) {
        console.log(error);
    }  
}

async function viewCart() {
    try {
        console.log(userData);
        
        const response = await fetch("http://localhost:8000/api/user/viewCart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(JSON.parse(sessionStorage.getItem("userData")))
        });

        if (!response.ok) {
            alert("Something went wrong");
            return;
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        if (data.body) {
            console.log('Storing HTML in sessionStorage...');
            sessionStorage.setItem('cartHtml', data.body);
            console.log('Stored HTML:', sessionStorage.getItem('cartHtml')); // Debugging line
            // Redirect to cartPage.html
            window.location.href = "./cartPage.html";
        } else {
            alert("Failed to fetch cart data");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function viewProduct(event) {

    // window.location.href = "./homePage.html"

    event.preventDefault();

    const btn = event.target;
    const btnId = btn.id.slice(7);
    console.log("Button ID:", btnId);

    const productDiv = btn.closest('.col-lg-3');
    const _id = productDiv.querySelector('.id').innerText;
    const name = productDiv.querySelector(`.name${btnId}`).innerText;
    const quantity = productDiv.querySelector(`.quantityInput${btnId}`).value;
    console.log(`Quantity: ${quantity}`);
    const price = (productDiv.querySelector(`.price${btnId}`).innerText).slice(1);
    const farmer = productDiv.querySelector(`.farmer${btnId}`).innerText.slice(8);
    console.log(farmer);
    console.log(productDiv.querySelector(`.farmer${btnId}`).innerText);
    const images = productDiv.querySelector(`.image${btnId}`).src;
    const quantityType = productDiv.querySelector(`.quantityType${btnId}`).innerText;
    console.log(quantityType+"heloo");
    const availableQuantity = productDiv.querySelector(`.productQuantity${btnId}`).textContent

    const available = extractNumber(availableQuantity)
    let prodData = {
        name,
        quantity,
        price,
        farmer,
        _id,
        userData,
        images,
        quantityType,
        available
    };
    
    try {
        const response = await fetch("http://localhost:8000/api/user/viewProduct",{
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(prodData)
        })

        if(response.ok) {
            const responseText = await response.json();
            const message = responseText.description
            // console.log(responseText.message);
            // alert(responseText.message)
            prodData = {
                name,
                quantity,
                price,
                farmer,
                _id,
                userData,
                images,
                quantityType,
                available,
                message
            };

            console.log(prodData);


            sessionStorage.setItem('viewProducts', JSON.stringify(prodData));
            // console.log(sessionStorage.getItem('viewProducts'));
            window.location.href = "./productPage.html"
    
            // console.log(response);            
        }
        else {
            // const message =  await response.json()
            const mes = await response.text()
            alert(mes)
        }


        
    } catch (error) {

        console.log(error);
        
    }

    const ht = `  <div class="container">
    <div class="product-info">
      <img src="images/strawberry.png" alt="Fresh Strawberries">
      <div class="details">
        <h3>Fresh Strawberries</h3>
        <p class="price">₹52 per dozen</p>
        <p>Available: 25 Dozens</p>
        <p>Farmer: Kiara Adwani</p>
        <div class="quantity">
          <label for="quantity">Quantity (dozens):</label>
          <input type="number" id="quantity" min="1" max="25">
        </div>
        <button class="btn btn-primary add-to-cart">Add to Cart</button>
      </div>
    </div>
  </div> `

}

async function saveProfile(event) {


    try {
        // const user = sessionStorage.getItem('userData');
        const name = document.getElementById('nameInput').value 
        const age = document.getElementById('ageInput').value 
        const gender = document.getElementById('genderInput').value 
        const email = document.getElementById('emailInput').value
        const phone =  document.getElementById('phoneInput').value 
        const country = document.getElementById('countryInput').value 
        // alert(JSON.stringify(userData))
        const state = document.getElementById('stateInput').value 
        const district = document.getElementById('districtInput').value 
        const city = document.getElementById('cityInput').value
        const street = document.getElementById('localityInput').value
        const pincode = document.getElementById('pincodeInput').value

        const user = {
            name,
            age,
            gender,
            email,
            phone,
            country,
            state,
            district,
            city,
            street,
            pincode
        }
        console.log(user);
        const response = await fetch("http://localhost:8000/api/user/saveProfile", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(user)
        })

        if(!response.ok){

        }
    }
    catch {

    }
}


async function deletetBut(event,i) {
    const btn = event.target;
    const btnId = btn.id.slice(12);
    console.log("Button ID:", btnId);
    console.log(btnId);
}


// async function visitProfile() {

// } 
// const frontForm = document.getElementById("registerForm");

// const frontForm = document.getElementById("registerForm");

