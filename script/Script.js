document.addEventListener('DOMContentLoaded', () => {

    const originalContent = {};
    const allSections = ['.section1', '.section2', '.section3', '.section4', '.section5', '.section6', '.section7'];
    allSections.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            originalContent[selector] = element.innerHTML;
        }
    });
    const section4 = document.querySelector('.section4');
    const section5 = document.querySelector('.section5');

    if (section4 && section5) {
        const tempContent = section4.innerHTML;
        section4.innerHTML = section5.innerHTML;
        section5.innerHTML = tempContent;
    }

    const semiAxisA = 10; 
    const semiAxisB = 7;  

    function calculateOvalArea(a, b) {
        return Math.PI * a * b;
    }

    const ovalArea = calculateOvalArea(semiAxisA, semiAxisB);
    const section3 = document.querySelector('.section3');

    if (section3) {
        const areaResultElement = document.createElement('p');
        areaResultElement.innerHTML = `<strong>Площа овала (з a=${semiAxisA}, b=${semiAxisB}): ${ovalArea.toFixed(2)}</strong>`;
        section3.prepend(areaResultElement);
    }

    const wordCountForm = document.getElementById('wordCountForm');
    const countButton = document.getElementById('countButton');
    const textInput = document.getElementById('textInput');

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }

    const savedWordCount = getCookie('wordCount');
    if (savedWordCount) {
        if (wordCountForm) {
            wordCountForm.style.display = 'none';
        }
        const deleteConfirm = confirm(`Збережена кількість слів: ${savedWordCount}. \n\nБажаєте видалити ці дані з cookies?`);
        if (deleteConfirm) {
            deleteCookie('wordCount');
            location.reload();
        } else {
            alert('Дані cookies не видалено. Для скидання перезавантажте сторінку та підтвердіть видалення.');
        }
    }
    if (countButton) {
        countButton.addEventListener('click', () => {
            const text = textInput.value;
            const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
            alert(`Кількість слів у тексті: ${wordCount}`);
            setCookie('wordCount', wordCount, 7);
        });
    }

    const alignButton = document.getElementById('alignButton');
    const chkS3 = document.getElementById('alignS3');
    const chkS4 = document.getElementById('alignS4');
    const chkS5 = document.getElementById('alignS5');
    const s3_align = document.querySelector('.section3');
    function applySavedAlignment() {
        const alignS3 = localStorage.getItem('alignS3') || 'center'; 
        if (s3_align) s3_align.style.textAlign = alignS3;
        if (chkS3) chkS3.checked = (alignS3 === 'left');

        const alignS4 = localStorage.getItem('alignS4') || 'center';
        if (section5) section5.style.textAlign = alignS4;
        if (chkS4) chkS4.checked = (alignS4 === 'left');

        const alignS5 = localStorage.getItem('alignS5') || 'center';
        if (section4) section4.style.textAlign = alignS5;
        if (chkS5) chkS5.checked = (alignS5 === 'left');
    }

    applySavedAlignment();
    if (alignButton) {
        alignButton.addEventListener('dblclick', () => {

            if (chkS3.checked) {
                if (s3_align) s3_align.style.textAlign = 'left';
                localStorage.setItem('alignS3', 'left');
            } else {
                if (s3_align) s3_align.style.textAlign = 'center'; 
                localStorage.setItem('alignS3', 'center'); 
            }

            if (chkS4.checked) {
                if (section5) section5.style.textAlign = 'left';
                localStorage.setItem('alignS4', 'left');
            } else {
                if (section5) section5.style.textAlign = 'center'; 
                localStorage.setItem('alignS4', 'center'); 
            }

            if (chkS5.checked) {
                if (section4) section4.style.textAlign = 'left';
                localStorage.setItem('alignS5', 'left');
            } else {
                if (section4) section4.style.textAlign = 'center'; 
                localStorage.setItem('alignS5', 'center'); 
            }

            alert('Налаштування вирівнювання збережено!');
        });
    }

    const blockSelectorList = document.getElementById('blockSelectorList');
    const editorForm = document.getElementById('editorForm');
    const editorTextarea = document.getElementById('editorTextarea');
    const saveContentButton = document.getElementById('saveContentButton');
    let currentEditTargetSelector = null;

    function createRestoreButton(selector) {
        const restoreButton = document.createElement('button');
        restoreButton.textContent = 'Відновити початковий вміст';
        restoreButton.className = 'restore-button';
        restoreButton.style.marginTop = '10px';

        restoreButton.addEventListener('click', () => {
            if (confirm('Ви впевнені, що хочете відновити початковий вміст?')) {
                localStorage.removeItem('content-' + selector);
                const block = document.querySelector(selector);
                if (block) {
                    block.innerHTML = originalContent[selector];
                    block.style.fontStyle = 'normal';
                }
            }
        });
        return restoreButton;
    }

    function applySavedContent() {
        allSections.forEach(selector => {
            const savedContent = localStorage.getItem('content-' + selector);
            const block = document.querySelector(selector);
            if (savedContent && block) {
                block.innerHTML = savedContent;
                block.style.fontStyle = 'italic';
                block.appendChild(createRestoreButton(selector));
            }
        });
    }

    applySavedContent();

    if (blockSelectorList) {
        blockSelectorList.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI' && e.target.dataset.target) {
                currentEditTargetSelector = e.target.dataset.target;
                const targetBlock = document.querySelector(currentEditTargetSelector);

                if (targetBlock) {
                    let currentHtml = targetBlock.innerHTML;
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = currentHtml;
                    const restoreBtn = tempDiv.querySelector('.restore-button');
                    if (restoreBtn) {
                        restoreBtn.remove();
                    }

                    editorTextarea.value = tempDiv.innerHTML;
                    editorForm.style.display = 'block';
                }
            }
        });
    }

    if (saveContentButton) {
        saveContentButton.addEventListener('click', () => {
            if (!currentEditTargetSelector) return;

            const newContent = editorTextarea.value;
            const block = document.querySelector(currentEditTargetSelector);

            if (block) {
                localStorage.setItem('content-' + currentEditTargetSelector, newContent);
                block.innerHTML = newContent;
                block.style.fontStyle = 'italic';
                block.appendChild(createRestoreButton(currentEditTargetSelector));

                editorForm.style.display = 'none';
                currentEditTargetSelector = null;
                alert('Вміст блоку оновлено!');
            }
        });
    }
});