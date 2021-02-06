const form = document.querySelector('#edituserform')

form.addEventListener('submit', async e => {

    e.preventDefault()

    const editForm = e.target
    const { id, picture, password, passConf, position, course } = editForm
    const [STUD, TEAC] = [...position]

    if (password.value !== passConf.value) {
        alert('Passwords don\'t match 😥')
        return
    }

    const editFormData = new FormData()

    editFormData.append(password.name, password.value)
    editFormData.append(course.name, course.value)
    editFormData.append(picture.name, picture.files[0])
    editFormData.append('position', STUD.checked ? STUD.value : TEAC.value)

    console.table(editFormData)
    
    try {
        const resp = await fetch('/users/edit/' + id.value, {
            method: 'POST',
            body: editFormData
        })

        if(resp.status === 200) {
            alert('Edit successfull! 😀')
            window.location.pathname='/users/profile'
        }
        else
            alert('The server has encountered an error, please retry later 😥')
    }catch(e){
        alert('An error has occurred during edit, please retry 😥')
    }
})
