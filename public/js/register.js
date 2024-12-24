
const registerForm = document.getElementById('registerForm')
const password = document.getElementById('password')
const confirmPassword = document.getElementById('confirmPassword')

registerForm.addEventListener('submit', (e) => {  
    e.preventDefault()
    if(password.value !== confirmPassword.value) {
        alert('Password and Confirm Password do not match')
        return
    } else {
        registerForm.submit()
    }
})


const urlParams = new URLSearchParams(window.location.search)
const error = urlParams.get('error')
console.log("error", error)
if (error) {
    const errorText = document.getElementById('errorText')
    if(error == "2") {
        errorText.textContent = 'Email already exists'
    } else {
        errorText.textContent = 'An error occured. Please try again'
    }  
    errorText.classList.remove('noDisplay')
}