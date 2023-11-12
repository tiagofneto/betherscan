function queryRPC(endpoint, method, params) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "jsonrpc": "2.0",
      "method": method,
      "params": params,
      "id": 1
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    return fetch(RPC_ENDPOINTS.MAINNET, requestOptions)
      .then(response => response.json())
      .then(data => data.result)
      .catch(error => console.error('error', error));
}
