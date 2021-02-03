const form = document.querySelector('#resourceEdit')

//const resourceList = []

form.addEventListener('submit', async e => {

    console.log('entrei')
    e.preventDefault()
    const editForm = e.target
    const { id, title, subtitle, type} = editForm
    //const [REPORT, THESIS, ARTICLE, APP, SLIDES, TEST, SOLVEDPROB] = [...themes]

    const postData = {}

    //console.log(resourceList)

    postData[title.name] = title.value
    postData[subtitle.name] = subtitle.value
    postData[type.name] = type.value
    
    console.table(postData)

    try {
        const resp = await fetch('/resources/edit/' + id.value, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(postData),
        })
        if(resp.status === 200) {
            alert('Resource edition successfull! 😀')
            //window.location.pathname='/posts/mine'
        }
        else
            alert('The server has encountered an error, please retry later 😥')
    }catch(e){
        alert('An error has occurred during signup, please retry 😥')
    }
})
