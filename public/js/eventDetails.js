function handleJoined(button, userId, username) {
    button.innerHTML = 'joined'
    button.classList.add('joined')
    const attendees = document.getElementById("attendees")
    if (attendees) {
        attendees.innerHTML += `<li id="attendee${userId}">${username}</li>`
        const attendeeCount = document.getElementById("attendeeCount")
        if (attendeeCount) {
            const [count, max] = attendeeCount.textContent.split('/')
            attendeeCount.textContent = (parseInt(count) + 1) + '/' + max
        }
    }
}

function handleLeft(button, userId) {
    button.innerHTML = 'join'
    button.classList.remove('joined')
    const attendee = document.getElementById("attendee" + userId)
    if (attendee) {
        attendee.remove()
        const attendeeCount = document.getElementById("attendeeCount")
        if (attendeeCount) {
            const [count, max] = attendeeCount.textContent.split('/')
            attendeeCount.textContent = (parseInt(count) - 1) + '/' + max
        }
    }
}