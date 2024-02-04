function onDocumentReady() {
    const address = extractAddressFromURL();

    const xpathLast = '//*[@id="ContentPlaceHolder1_trContract"]';
    const lastElement = document.evaluate(xpathLast, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    showLoadingIndicator(lastElement);

    fetchAdditionalData(address).then(data => {
        document.getElementById("loading-indicator").remove();
        displayDataOnPage(data, lastElement);
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
    
    let slicedData = trimHex(dataContent);

    newElement.innerHTML = `
        <h4 class="text-cap mb-1 mt-1">
            ${dataTitle}
        </h4>
        <div>
            <a data-bs-toggle="tooltip" data-bs-trigger="hover">
                <span data-highlight-target="${dataContent}">${slicedData}</span>
            </a>
            <a 
                class="js-clipboard link-secondary" 
                href="javascript:;" 
                data-clipboard-text="${dataContent}" 
                data-bs-toggle="tooltip" 
                data-bs-trigger="hover" 
                data-hs-clipboard-options="{ &quot;type&quot;: &quot;tooltip&quot;, &quot;successText&quot;: &quot;Copied!&quot;, &quot;classChangeTarget&quot;: &quot;#linkIcon_1&quot;, &quot;defaultClass&quot;: &quot;fa-copy&quot;, &quot;successClass&quot;: &quot;fa-check&quot; }" 
                aria-label="Copy ${dataTitle}" 
                data-bs-original-title="null">
        
                <i id="linkIcon_1" class="far fa-fw fa-copy"></i> 
            </a>
        </div>
    `;
    afterElement.parentNode.insertBefore(newElement, afterElement.nextSibling);
}

function displayDataOnPage(data, lastElement) {
    insertElement(lastElement, data.codeHash, "Code Hash");
    insertElement(lastElement, data.storageHash, "Storage Root");
}

function showLoadingIndicator(lastElement) {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.setAttribute('id', 'loading-indicator');

    loadingIndicator.innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;

    lastElement.parentNode.insertBefore(loadingIndicator, lastElement.nextSibling);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
} else {
    onDocumentReady();
}

