const form = document.querySelector('#postEdit')

//const resourceList = []

form.addEventListener('submit', async e => {

    console.log('entrei')
    e.preventDefault()
    const editForm = e.target
    const { id, title, subtitle, content, themes} = editForm
    const [REPORT, THESIS, ARTICLE, APP, SLIDES, TEST, SOLVEDPROB] = [...themes]

    const postData = {}

    //console.log(resourceList)

    postData[title.name] = title.value
    postData[subtitle.name] = subtitle.value
    postData['themes'] = [...themes].filter(t => t.checked).map(t => t.value)
    postData[content.name] = content.value
    //postData['resources'] = resourceList

    console.table(postData)

    try {
        const resp = await fetch('/posts/edit/' + id.value, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(postData),
        })
        if(resp.status === 200) {
            alert('Post edition successfull! 😀')
            //window.location.pathname='/posts/mine'
        }
        else
            alert('The server has encountered an error, please retry later 😥')
    }catch(e){
        alert('An error has occurred during signup, please retry 😥')
    }
})