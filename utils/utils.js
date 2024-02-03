async function queryRPC(endpoint, method, params) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "jsonrpc": "2.0",
      method,
      params,
      "id": 1
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    return fetch(endpoint, requestOptions)
      .then(response => response.json())
      .then(data => data.result)
      .catch(error => console.error('error', error));
}
