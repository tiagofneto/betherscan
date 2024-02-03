function onDocumentReady() {
    const blockNumber = extractBlockNumberFromURL();

    showLoadingIndicator();

    fetchAdditionalData(blockNumber).then(data => {
        document.getElementById("loading-indicator").remove();
        displayDataOnPage(data);
    });
};

function extractBlockNumberFromURL() {
    let str = window.location.pathname.split('/')[2];
    return '0x' + parseInt(str).toString(16);
}

async function fetchAdditionalData(blockNumber) {
    return queryRPC(RPC_ENDPOINTS.MAINNET, 'eth_getBlockByNumber', [blockNumber, true]);
}

function insertElement(afterElement, dataContent, dataTitle) {
    const newElement = document.createElement('div');
    newElement.classList.add('row', 'mb-4');

    newElement.innerHTML = `
        <div class="col-md-3 text-dt mb-2 mb-md-0">
            <!-- <i class="far fa-question-circle me-1" data-bs-container="body" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-original-title="" title="" data-bs-content="The root of the transactions trie"></i> -->
            <i class="far fa-wrench me-1"></i>
            ${dataTitle}:
        </div>
        <div class="col-md-9">
            ${dataContent}
        </div>
    `;
    afterElement.parentNode.insertBefore(newElement, afterElement.nextSibling);
}

const xpathLast = '//*[@id="collapseContent"]/div[last()]';
const lastElement = document.evaluate(xpathLast, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
lastElement.classList.add('mb-4');

function displayDataOnPage(data) {
    insertElement(lastElement, data.logsBloom, "LogBloom");
    insertElement(lastElement, data.mixHash, "MixHash");
    insertElement(lastElement, data.receiptsRoot, "ReceiptsRoot");
    insertElement(lastElement, data.transactionsRoot, "TransactionsRoot");
}

function showLoadingIndicator() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.setAttribute('id', 'loading-indicator');

    loadingIndicator.innerHTML = `
        <div class="d-flex justify-content-center mb-4">
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
