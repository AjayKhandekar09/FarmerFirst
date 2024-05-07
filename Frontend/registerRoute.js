
const frontForm = document.getElementById("registerForm")

const submitFunction = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)

    console.log(typeof formData)
    // console.log(formData.get("pincode"));
    const requestedData = {
        username : formData.get("name"),
        // fullName: formData.get("age"),
        age: formData.get("age"),
        gender: formData.get("gender"),
        password: formData.get("password"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        street: formData.get("street"),
        city: formData.get("city"),
        district: formData.get("district"),
        country: formData.get("country"),
        pincode: formData.get("pincode"),
    }

    console.log(requestedData);

    try {
        const response = await fetch("http://localhost:8000/api/user/register" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestedData)
        })
        if(response?.ok) {
            
                alert("User registered successfully!");
            
            // Redirect to home page
            window.location.href = "/homePage.html";
        }
        else {
            const responseDate = await response.json()
            
                alert(responseDate.message)

            
        }
        
    } catch (error) {
        console.log(error);
    }
}

const xy = frontForm.addEventListener("submit",submitFunction)