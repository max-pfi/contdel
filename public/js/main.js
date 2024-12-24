const base_url = "http://localhost:3000";

let joinButtonDisabled = false

function navigateToEvent(id) {
    window.location.href = `${base_url}/event?id=${id}`
}

function navigateToEdit(event, eventId) {
    event.stopPropagation()
    window.location.href = `${base_url}/event/edit?id=${eventId}`

}


function toggleJoinEvent(event, id) {
    event.stopPropagation()
    if (joinButtonDisabled) {
        return
    }
    joinButtonDisabled = true
    event.stopPropagation()
    const button = event.target
    const initialText = button.textContent
    button.innerHTML = '<div class="loader"/>'
    fetch(
        `${base_url}/event/toggleJoin?id=${id}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        }
    ).then(response => {
        if (response.ok) {
            return response.json()
        }
        throw new Error('Request failed!')
    })
        .then(data => {
            if (data.status === 'joined') {
                handleJoined(button, data.userId, data.username, id)
            } else if(data.status === 'left') {
                handleLeft(button, data.userId, id)
            } else if (data.status === 'full') {
                button.innerHTML = initialText
                alert('Event already full')
            }
        }).catch(() => {
            console.error('Error')
            button.innerHTML = initialText
        })
    joinButtonDisabled = false
}


window.addEventListener("load", function() {
    if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
        window.location.reload();
    }
});