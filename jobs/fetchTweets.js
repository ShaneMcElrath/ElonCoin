const axios = require('axios');




async function getTwitter() {
  
  

  let options = {
    url: `http://localhost:${process.env.PORT}/api/posts/tweet`,
    method: 'GET',
    headers: {
      cookie: 'guest_id_marketing=v1%253A164314130670391939; guest_id_ads=v1%253A164314130670391939; personalization_id=%22v1_miJD3PLKTUfq5vx2k8n8eQ%3D%3D%22; guest_id=v1%253A164314130670391939; '
    }
  };

  axios(options)
  .then((response) => {
    console.log(response);
  })
  .catch(err => {
    if (err) throw err;
  });
}



getTwitter();

