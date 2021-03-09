async function deletePost(id) {
  try {
    const resp = await fetch('/posts/' + id, {
      method: 'DELETE',
    })
    if (resp.status === 200) {
      alert('Post successfully ❌ deleted! 😀')
      window.location.reload()
    } else alert('The server has encountered an error, please retry later 😥')
  } catch (e) {
    alert('An error has trying to add the comment, please retry 😥')
  }
}

async function deleteResource(id) {
  try {
    const resp = await fetch('/resources/' + id, {
      method: 'DELETE',
    })
    if (resp.status === 200) {
      alert('Resource successfully ❌ deleted! 😀')
      window.location.reload()
    } else alert('The server has encountered an error, please retry later 😥')
  } catch (e) {
    alert('An error has trying to add the comment, please retry 😥')
  }
}

async function deleteUser(id) {
  try {
    const resp = await fetch('/users/' + id, {
      method: 'DELETE',
    })
    if (resp.status === 200) {
      alert('User successfully ❌ deleted! 😀')
      window.location.reload()
    } else alert('The server has encountered an error, please retry later 😥')
  } catch (e) {
    alert('An error has trying to add the comment, please retry 😥')
  }
}
