function onDocumentReady() {
    const address = extractAddressFromURL();

    const xpathLast = '//*[@id="ContentPlaceHolder1_divSummary"]/div[2]/div[2]/div/div/div[last()]';
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
    return queryRPC('eth_getProof', [address, ["0x0"],"latest"]);
}

function insertElement(afterElement, dataContent, dataTitle, isContract = false) {
    const newElement = document.createElement('div');

    if (!isNumeric(dataContent)) {
        console.error(dataTitle + " is not numeric");
        return;
    }
    
    let slicedData = isContract ? trimHex(dataContent) : dataContent;

    newElement.innerHTML = `
        <h4 class="text-cap mb-1">
            ${dataTitle}
        </h4>
        <div>
            ${isContract ? `
            <a data-bs-toggle="tooltip" data-bs-trigger="hover">
                <span data-highlight-target="${dataContent}">${slicedData}</span>
            </a>
            <a 
                class="js-clipboard link-secondary" 
                href="javascript:;" 
                data-clipboard-text="${dataContent}" 
                data-bs-toggle="tooltip" 
                data-hs-clipboard-options="{ &quot;type&quot;: &quot;tooltip&quot;, &quot;successText&quot;: &quot;Copied!&quot;, &quot;classChangeTarget&quot;: &quot;#linkIcon_1&quot;, &quot;defaultClass&quot;: &quot;fa-copy&quot;, &quot;successClass&quot;: &quot;fa-check&quot; }" 
                data-bs-trigger="hover" 
                aria-label="Copy ${dataTitle}" 
                data-bs-original-title="null">
        
                <i id="linkIcon_1" class="far fa-fw fa-copy"></i> 
            </a>` : slicedData}
        </div>
    `;
    afterElement.parentNode.insertBefore(newElement, afterElement.nextSibling);
}

function displayDataOnPage(data, lastElement) {
    const isContract = document.getElementById("ContentPlaceHolder1_li_contracts") !== null;

    if (isContract) {
        insertElement(lastElement, data.codeHash ?? data.keccakCodeHash, "Code Hash", true);
        insertElement(lastElement, data.storageHash, "Storage Root", true);
    } else {
        insertElement(lastElement, data.nonce, "Nonce");
    }
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

