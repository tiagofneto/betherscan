function onDocumentReady() {
    const blockNumber = extractBlockNumberFromURL();

    const xpathLast = '//*[@id="collapseContent"]/div[last()]';
    const lastElement = document.evaluate(xpathLast, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    lastElement.classList.add('mb-4');

    showLoadingIndicator(lastElement);

    fetchAdditionalData(blockNumber).then(data => {
        document.getElementById("loading-indicator").remove();
        displayDataOnPage(data, lastElement);
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

    if (!isNumeric(dataContent)) {
        console.error(dataTitle + " is not numeric");
        return;
    }

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

function rlp_encode_block(block) {
    console.log(block)
    arr = [
        block.parentHash,
        block.sha3Uncles,
        block.miner,
        block.stateRoot,
        block.transactionsRoot,
        block.receiptsRoot,
        block.logsBloom,
        parseInt(block.difficulty, 16) == 0 ? "0x" : block.difficulty,
        block.number,
        block.gasLimit,
        block.gasUsed,
        block.timestamp,
        block.extraData,
        block.mixHash,
        block.nonce,
    ];

    if (block.baseFeePerGas) {
        arr.push(block.baseFeePerGas);
    }
    if (block.withdrawalsRoot) {
        arr.push(block.withdrawalsRoot);
    }

    return rlp_encode(arr);
}

function displayDataOnPage(data, lastElement) {
    insertElement(lastElement, rlp_encode_block(data), "RLP");
    insertElement(lastElement, data.logsBloom, "LogBloom");
    insertElement(lastElement, data.mixHash, "MixHash");
    insertElement(lastElement, data.receiptsRoot, "ReceiptsRoot");
    insertElement(lastElement, data.transactionsRoot, "TransactionsRoot");
}

function showLoadingIndicator(lastElement) {
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
