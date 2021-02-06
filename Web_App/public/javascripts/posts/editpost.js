const form = document.querySelector('#postEdit')

let resourceList = []

const fetchResources = async () =>{
    const routes = window.location.href.split('/')
    const postId = routes[routes.length-1]
    const resp = await fetch(`/posts/${postId}/resources`)
    const resources = await resp.json()
    resourceList.push(...resources)
}

fetchResources()

form.addEventListener('submit', async e => {

    e.preventDefault()
    const editForm = e.target
    const { id, title, subtitle, content, themes} = editForm
    const [REPORT, THESIS, ARTICLE, APP, SLIDES, TEST, SOLVEDPROB] = [...themes]

    const postData = {}

    postData[title.name] = title.value
    postData[subtitle.name] = subtitle.value
    postData['themes'] = [...themes].filter(t => t.checked).map(t => t.value)
    postData[content.name] = content.value
    postData['resources'] = resourceList

    console.table(postData)

    try {
        const resp = await fetch('/posts/edit/' + id.value, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(postData),
        })
        if(resp.status === 200) {
            alert('Post edition successfull! 😀')
            window.location.pathname='/users/profile'
        }
        else
            alert('The server has encountered an error, please retry later 😥')
    }catch(e){
        alert('An error has occurred during signup, please retry 😥')
    }
})

function addResource(id,title){
    
    
    const resourceItem = $(`
    <li id="item${id}" class="d-flex justify-content-between align-items-center mb-3"> 
    <a href="/resources/${id}">
    ${title}
    </a>
    <button type="button" class="btn btn-danger mx-3" onclick="removeResource('${id}')">
    Remove
    </button>
    </li>)`)
    
    $($('#addedResourceList')).append(resourceItem)
    $('#btnadd'+id).attr('disabled', true)
    
    resourceList.push({_id: id, title: title})
}

function removeResource(id){
    $('#btnadd'+id).attr('disabled', false)
    $($(`#addedResourceList > #item${id}`)).remove()

    resourceList = resourceList.filter(x=>x._id!=id)

}
