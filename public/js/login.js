const urlParams = new URLSearchParams(window.location.search)
const error = urlParams.get('error')
console.log("error", error)
if (error) {
    const errorText = document.getElementById('errorText')
    if(error == "2") {
        errorText.textContent = 'Incorrect username or password. Please try again.'
    } else {
        errorText.textContent = 'An error occured. Please try again.'
    }  
    errorText.classList.remove('noDisplay')
}