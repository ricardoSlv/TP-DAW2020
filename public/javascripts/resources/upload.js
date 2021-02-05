
const form = document.querySelector('#uploadform')

form.addEventListener('submit', async e => {

    e.preventDefault()

    const uploadForm = e.target
    const { title, subtitle, type, createdAt, zip , public} = uploadForm
    const [REPORT, THESIS, ARTICLE, APP, SLIDES, TEST, SOLVEDPROB] = [...type]

    const uploadFormData = new FormData()

    uploadFormData.append(title.name, title.value)
    uploadFormData.append(subtitle.name, subtitle.value)
    uploadFormData.append(createdAt.name, createdAt.value)
    uploadFormData.append(zip.name, zip.files[0])
    uploadFormData.append(public.name, public.checked)
    type.forEach(t=>t.checked&&uploadFormData.append(t.name, t.value))

    console.table([...uploadFormData.entries()])

    try {
        const resp = await fetch('/resources/upload', {
            method: 'POST',
            body: uploadFormData,
        })

        if(resp.status === 200) {
            alert('Upload successfull! 😀')
            window.location.pathname='/resources/upload'
        }
        else
            alert('The server has encountered an error, please check your manifest.json or retry later 😥')
    }catch(e){
        alert('An error has occurred during signup, please retry 😥')
    }


})
