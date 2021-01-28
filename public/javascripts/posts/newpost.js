const form = document.querySelector('#postForm')

form.addEventListener('submit', async e => {

    e.preventDefault()

    const uploadForm = e.target
    const { title, subtitle, themes, content} = uploadForm
    const [REPORT, THESIS, ARTICLE, APP, SLIDES, TEST, SOLVEDPROB] = [...themes]

    const uploadFormData = new FormData()

    uploadFormData.append(title.name, title.value)
    uploadFormData.append(subtitle.name, subtitle.value)
    uploadFormData.append("themes", [...themes].filter(t => t.checked).map(t => t.value))
    uploadFormData.append(content.name, content.value)
    console.table([...uploadFormData.entries()])

    try {
        const resp = await fetch('/posts/upload', {
            method: 'POST',
            body: uploadFormData,
        })
        if(resp.status === 200) {
            alert('Post creation successfull! 😀')
            window.location.pathname='/posts/upload'
        }
        else
            alert('The server has encountered an error, please retry later 😥')
    }catch(e){
        alert('An error has occurred during signup, please retry 😥')
    }


})
