async function newFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value;
  const post_url = document.querySelector('input[name="post-url"]').value;

  const response = await fetch(`/api/posts/tweet`);

  if (response.ok) {
    document.location.replace('/');
  } else {
    alert(response.statusText);
  }
}


var interval = setInterval(newFormHandler, 20000);