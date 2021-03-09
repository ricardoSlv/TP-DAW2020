const form = document.querySelector('#commentForm')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const commentForm = e.target
  const { text } = commentForm

  try {
    const resp = await fetch(window.location.href + '/comment/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.value }),
    })
    if (resp.status === 200) {
      alert('Comment successfully added! 😀')
      window.location.reload()
    } else alert('The server has encountered an error, please retry later 😥')
  } catch (e) {
    alert('An error has trying to add the comment, please retry 😥')
  }
})

async function switchFavourite(idUser, idPost, isFavourite, postTitle) {
  try {
    if (isFavourite) {
      const resp = await fetch(`/users/${idUser}/favouritesPosts/${idPost}`, {
        method: 'DELETE',
      })
      if (resp.status === 200) {
        alert('Post Sucessfully removed from favourites! 😀')
        window.location.reload()
      } else alert('The server has encountered an error, please retry later 😥')
    } else {
      const resp = await fetch(`/users/${idUser}/favouritesPosts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: idPost, title: postTitle }),
      })
      if (resp.status === 201) {
        alert('Post Sucessfully added to favourites! 😀')
        window.location.reload()
      } else alert('The server has encountered an error, please retry later 😥')
    }
  } catch (e) {
    alert('An error has trying to add the comment, please retry 😥')
  }
}

async function removeComment(idComment) {
  try {
    const resp = await fetch(window.location.href + '/' + idComment, {
      method: 'DELETE',
    })
    if (resp.status === 200) {
      alert('Comment sucessfullly deleted! 😀')
      window.location.reload()
    } else alert('The server has encountered an error, please retry later 😥')
  } catch (e) {
    alert('An error has trying to add the comment, please retry 😥')
  }
}
