
const form = document.querySelector('#loginform')

form.addEventListener('submit', async e => {

    e.preventDefault()

    const loginForm = e.target
    const { email, password, remember } = loginForm

    const loginFormData = new FormData()

    loginFormData.append(email.name, email.value)
    loginFormData.append(password.name, password.value)
    loginFormData.append(remember.name, remember.checked)

    console.table([...loginFormData.entries()])

    try {
        const resp = await fetch('/login', {
            method: 'POST',
            body: loginFormData,
        })

        if(resp.status === 200) {
            alert('Login successfull! 😀')
            window.location.pathname='/'
        }
        else if(resp.status === 401)
            alert('Email or password wrong 😥')
        else
            alert('The server has encountered an error, please retry later 😥')
    }catch(e){
        alert('An error has occurred during login, please retry 😥')
    }

})
