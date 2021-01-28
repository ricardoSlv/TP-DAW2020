const form = document.querySelector('#commentForm')

form.addEventListener('submit', async e => {

    e.preventDefault()

    const commentForm = e.target
    const {text} = commentForm
    console.log({text: text.value})

    try {
        const resp = await fetch(window.location.href+'/comment/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: text.value}),
        })
        if(resp.status === 200) {
            alert('Comment successfully added! 😀')
            window.location.reload()
        }
        else
            alert('The server has encountered an error, please retry later 😥')
    }catch(e){
        alert('An error has trying to add the comment, please retry 😥')
    }
})
