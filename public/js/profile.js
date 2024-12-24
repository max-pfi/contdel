function handleLeft(button, userId, eventId){
    const post = document.getElementById("post"+eventId)
    if(post) {
        post.remove()
    }
}

const logoutButton = document.getElementById("logoutButton")
logoutButton.addEventListener("click", function(){
    window.location.href = "/login/logout"
})

const deleteProfileButton = document.getElementById("deleteProfileButton")
deleteProfileButton.addEventListener("click", function(){
    fetch("/profile", {
        method: "DELETE"
    }).then(response => {
        if(response.ok){
            window.location.href = "/login/logout"
        } else {
            throw new Error("Failed to delete profile")
        }
    }).catch(error => {
        alert("Failed to delete profile. Please try again later.")
    })
})