const form = document.querySelector('#loginform')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const loginForm = e.target
  const { email, password, remember } = loginForm

  const loginData = {}

  loginData[email.name] = email.value
  loginData[password.name] = password.value
  loginData[remember.name] = remember.checked

  console.table(loginData)

  try {
    const resp = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    })

    if (resp.status === 200) {
      alert('Login successfull! 😀')
      window.location.pathname = '/'
    } else if (resp.status === 401) alert('Email or password wrong 😥')
    else alert('The server has encountered an error, please retry later 😥')
  } catch (e) {
    alert('An error has occurred during login, please retry 😥')
  }
})
