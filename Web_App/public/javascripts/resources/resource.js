async function switchFavourite(idUser, idResource, isFavourite, postTitle) {
  try {
    if (isFavourite) {
      const resp = await fetch(
        `/users/${idUser}/favouritesResources/${idResource}`,
        {
          method: 'DELETE',
        }
      )
      if (resp.status === 200) {
        alert('Resource Sucessfully removed from favourites! 😀')
        window.location.reload()
      } else alert('The server has encountered an error, please retry later 😥')
    } else {
      const resp = await fetch(`/users/${idUser}/favouritesResources/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: idResource, title: postTitle }),
      })
      if (resp.status === 201) {
        alert('Resource Sucessfully added to favourites! 😀')
        window.location.reload()
      } else alert('The server has encountered an error, please retry later 😥')
    }
  } catch (e) {
    alert('An error has trying to add the comment, please retry 😥')
  }
}

// document.addEventListener("adobe_dc_view_sdk.ready", function(){
// 	var adobeDCView = new AdobeDC.View({clientId: "<YOUR_CLIENT_ID>", divId: "adobe-dc-view"});
// 	adobeDCView.previewFile({
// 		content:{location: {url: "https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf"}},
// 		metaData:{fileName: "Bodea Brochure.pdf"}
// 	}, {});
// });
