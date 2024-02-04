function onDocumentReady() {
    const address = extractAddressFromURL();

    fetchAdditionalData(address).then(data => {
        //document.getElementById("loading-indicator").remove();
        displayDataOnPage(data);
    });
};

function extractAddressFromURL() {
    return window.location.pathname.split('/')[2];
}

async function fetchAdditionalData(address) {
    return queryRPC(RPC_ENDPOINTS.MAINNET, 'eth_getProof', [address, ["0x0"],"latest"]);
}

function insertElement(afterElement, dataContent, dataTitle) {
    const newElement = document.createElement('div');
    //newElement.classList.add('row', 'mb-4');
    
    // First 8 chars + ... + last 8 chars
    let slicedData = dataContent.slice(0, 8) + "..." + dataContent.slice(-8);

    newElement.innerHTML = `
        <h4 class="text-cap mb-1">
            ${dataTitle}:
        </h4>
        <div>
            ${slicedData}
        </div>
    `;
    afterElement.parentNode.insertBefore(newElement, afterElement.nextSibling);
}

function displayDataOnPage(data) {
    const xpathLast = '//*[@id="ContentPlaceHolder1_trContract"]';
    const lastElement = document.evaluate(xpathLast, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //lastElement.classList.add('mb-4');

    insertElement(lastElement, data.codeHash, "Code Hash");
    insertElement(lastElement, data.storageHash, "Storage Root");
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
} else {
    onDocumentReady();
}

