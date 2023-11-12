function onDocumentReady() {
    const blockNumber = extractBlockNumberFromURL();
    fetchAdditionalData(blockNumber).then(data => {
        displayDataOnPage(data);
    });
};

function extractBlockNumberFromURL() {
    return window.location.pathname.split('/')[2];
}

function fetchAdditionalData(blockNumber) {
    return queryRPC(RPC_ENDPOINTS.MAINNET, 'eth_getBlockByNumber', [blockNumber, true]);
}

function insertRootElement(afterElement, dataContent, dataTitle) {
    const newElement = document.createElement('div');
    newElement.classList.add('row', 'mb-4');

    newElement.innerHTML = `
        <div class="col-md-3 text-dt mb-2 mb-md-0">
            <!-- <i class="far fa-question-circle me-1" data-bs-container="body" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-original-title="" title="" data-bs-content="The root of the transactions trie"></i> -->
            ${dataTitle}:
        </div>
        <div class="col-md-9">
            ${dataContent}
        </div>
    `;
    afterElement.parentNode.insertBefore(newElement, afterElement.nextSibling);
}

function displayDataOnPage(data) {
    const xpath = '//*[@id="collapseContent"]/div[3]';
    const targetElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (targetElement) {
        insertRootElement(targetElement, data.receiptsRoot, "ReceiptsRoot");
        insertRootElement(targetElement, data.transactionsRoot, "TransactionsRoot");
    } else {
        console.error('Could not find element to copy');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
} else {
    onDocumentReady();
}
