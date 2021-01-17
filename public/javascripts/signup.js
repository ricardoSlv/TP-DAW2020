
const form = document.querySelector('#signupform')

form.addEventListener('submit', async e => {

    e.preventDefault()

    const signupForm = e.target
    const { name, email, picture, password, passConf, position, course } = signupForm
    const [STUD, TEAC] = [...position]

    if (password.value !== passConf.value) {
        alert('Passwords don\'t match 😥')
        return
    }

    const signupFormData = new FormData()

    signupFormData.append(name.name, name.value)
    signupFormData.append(email.name, email.value)
    signupFormData.append(password.name, password.value)
    signupFormData.append(course.name, course.value)
    signupFormData.append(picture.name, picture.files[0])
    STUD.checked ? signupFormData.append(STUD.name, STUD.value)
    : signupFormData.append(TEAC.name, TEAC.value)

    console.table([...signupFormData.entries()])

    try {
        const resp = await fetch('/signup', {
            method: 'POST',
            body: signupFormData,
        })

        if(resp.status === 200) {
            alert('Signup successfull! 😀')
            window.location='/login'
        }
        else if(resp.status === 409)
            alert('Name or Email already in use 😥')
        else
            alert('The server has encountered an error, please retry later 😥')
    }catch(e){
        alert('An error has occurred during signup, please retry 😥')
    }


})
