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

    const editData = new FormData()

    editData[password.name] = password.value
    editData[course.name] = course.value
    editData['position'] = STUD.checked ? STUD.value : TEAC.value
    console.table(editData)
    
    try {
        const resp = await fetch('/users/edit/' + id.value, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(editData)
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
