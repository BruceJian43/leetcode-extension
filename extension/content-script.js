const LAYOUT_DIV_CLASS_NAME = 'layout__3fIJ';
const CODING_AREA_DIV_CLASS_NAME = 'code-area__24hN';
const BUTTONS_CONTAINER_DIV_CLASS_NAME = 'btns__1OeZ';

function getFilename() {
    const questionTitleDiv = document.querySelector('.css-v3d350');
    const questionTitle = questionTitleDiv == null ? 'Unknown' : questionTitleDiv.innerText.replace('. ', '-');
    const fileExtensionDiv = document.querySelector('.ant-select-selection-selected-value');
    const fileExtension = fileExtensionDiv == null ? 'txt' : (() => {
        switch (fileExtensionDiv.innerText) {
            case 'C++': return 'cpp';
            case 'Java': return 'java';
            case 'Python': return 'py';
            case 'Python3': return 'py';
            case 'C': return 'c';
            case 'C#': return 'cs';
            case 'JavaScript': return 'js';
            case 'Ruby': return 'rb';
            case 'Swift': return 'swift';
            case 'Go': return 'go';
            case 'Scala': return 'scala';
            case 'Kotlin': return 'kt';
            case 'Rust': return 'rs';
            case 'PHP': return 'php';
            case 'TypeScript': return 'ts';
            case 'Racket': return 'rkt';
            case 'Erlang': return 'erl';
            case 'Elixir': return 'ex';
            default: return 'txt';
        }
    })();
    const filename = `${questionTitle}.${fileExtension}`;
    return filename
}


function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


function addDownloadButton(container) {
    const firstButton = container.querySelector('.tool-item__2DCU');
    if (firstButton != null) {
        const downloadButton = firstButton.cloneNode(true);
        container.insertBefore(downloadButton, firstButton);
        const path = downloadButton.querySelector('path');
        path.setAttribute('d', 'M 6 3 L 9 3 V 15 H 13 L 7 22 L 1 15 L 5 15 L 5 3');
        downloadButton.addEventListener('click', () => {
            const codeMirror = document.querySelector('.CodeMirror-code');
            if (codeMirror != null) {
                const codeWithLineNumber = codeMirror.innerText;
                const code = codeWithLineNumber.split('\n').filter((elem, index) => {
                    return (index & 1);
                }).join('\n').normalize('NFKD');
                const filename = getFilename();
                download(filename, code);
            }
        })
    }
}

/**
 * Wait for <div class="btns__1OeZ">
 * @param {MutationRecord[]} mutations
 * @param {MutationObserver} observer
 */
function layoutObserverCallback(mutations, observer) {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
                if (node.classList.contains(CODING_AREA_DIV_CLASS_NAME)) {
                    const buttonsContainer = node.querySelector(`.${BUTTONS_CONTAINER_DIV_CLASS_NAME}`);
                    if (buttonsContainer != null) {
                        addDownloadButton(buttonsContainer);
                    }
                }
            }
        }
    }
}

/**
 * Wait for <div class="layout__3fIJ">
 * @param {MutationRecord[]} mutations
 * @param {MutationObserver} observer
 */
function bodyObserverCallback(mutations, observer) {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
                if (node.classList.contains(LAYOUT_DIV_CLASS_NAME)) {
                    const buttonsContainer = document.querySelector(`.${BUTTONS_CONTAINER_DIV_CLASS_NAME}`);
                    if (buttonsContainer == null) {
                        const layoutObserver = new MutationObserver(layoutObserverCallback);
                        layoutObserver.observe(node, { subtree: true, childList: true });
                    } else {
                        addDownloadButton(node);
                    }
                }
            }
        }
    }
}

const bodyObserver = new MutationObserver(bodyObserverCallback);
bodyObserver.observe(document.body, { subtree: true, childList: true });