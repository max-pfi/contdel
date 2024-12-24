function onScroll() {
    const title = document.getElementById('pageTitle');
    const navTitle = document.getElementById('navTitle');
    const nav = document.querySelector('nav');
    const rect = title.getBoundingClientRect();
    if (rect.top < 80) {
        title.style.opacity = 0;
        navTitle.style.opacity = 1;
        nav.classList.add('boxShadow');

    } else {
        title.style.opacity = 1;
        navTitle.style.opacity = 0;
        nav.classList.remove('boxShadow');
    }
}

window.onload = function () {
    onScroll();
}

window.addEventListener('scroll', onScroll)


function handleJoined(button, userId, username, eventId) {
    button.innerHTML = 'Joined'
    button.classList.add('joined')
    const attendeeCount = document.getElementById("attendeeCount" + eventId)
    if (attendeeCount) {
        const [count, max] = attendeeCount.textContent.split('/')
        attendeeCount.textContent = (parseInt(count) + 1) + '/' + max
    }

}

function handleLeft(button, userId, eventId) {
    button.innerHTML = 'Join'
    button.classList.remove('joined')
    const attendeeCount = document.getElementById("attendeeCount" + eventId)
    if (attendeeCount) {
        const [count, max] = attendeeCount.textContent.split('/')
        attendeeCount.textContent = (parseInt(count) - 1) + '/' + max
    }
}
