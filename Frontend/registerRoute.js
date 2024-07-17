const frontForm = document.getElementById("registerForm");

const submitFunction = async (event) => {
    event.preventDefault();

    const users = new FormData(event.target);
    const formData = new FormData();
    formData.append('username', users.get('name'));
    formData.append('age', users.get('age'));
    formData.append('gender', users.get('gender'));
    formData.append('password', users.get('password'));
    formData.append('phone', users.get('phone'));
    formData.append('email', users.get('email'));
    formData.append('street', users.get('street'));
    formData.append('city', users.get('city'));
    formData.append('district', users.get('district'));
    formData.append('country', users.get('country'));
    formData.append('pincode', users.get('pincode'));
    formData.append('state', users.get('state'));

    const profilePhotoFile = document.getElementById("profilePhoto").files[0];
    formData.append('profilePhoto', profilePhotoFile);

    // Validate phone number length
    const phone = users.get("phone");
    if (phone.toString().length !== 10) {
        alert("Enter valid Phone Number");
        return;
    }

    // Validate password confirmation
    const password = users.get("password");
    const confirmPassword = users.get("cp");
    if (password !== confirmPassword) {
        alert("Confirm your password correctly");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/api/user/register", {
            method: "POST",
            body: formData
        });

        const responseData = await response.json(); // Parse JSON response

        if (response.ok) {
            alert("User registered successfully!");
            window.location.href = "./homePage.html"; // Redirect upon success
        } else {
            alert(responseData.message || "Failed to register user"); // Display error message from server
        }

    } catch (error) {
        console.error("Error:", error);
        // alert("Failed to register user"); // Generic error message
    }
};

frontForm.addEventListener("submit", submitFunction);
