document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = 'https://www.4vsk.jelgava.lv/images/';
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;
    const currentMonth = today.getMonth() + 1;
    const pdfListSections = {
        today: document.getElementById('today-list'),
        tomorrow: document.getElementById('tomorrow-list'),
        older: document.getElementById('older-list')
    };
    const warningPopup = document.getElementById('warning-popup');
    const loadingIndicator = document.getElementById('loading');

    function showLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
    }

    function hideLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }

    function generateUrls() {
        const urls = [];
        const month = String(currentMonth).padStart(2, '0');
        const yearRange = `${currentYear}_${nextYear}`;
        const basePath = `${baseUrl}${yearRange}/macibu_process/`;
        const todayStr = String(today.getDate()).padStart(2, '0');
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowStr = String(tomorrow.getDate()).padStart(2, '0');

        for (let day = 1; day <= today.getDate() + 1; day++) {
            const dayStr = String(day).padStart(2, '0');
            const url = `${basePath}${dayStr}_${month}_${currentYear}_st_sar.pdf`;
            urls.push({
                url: url,
                date: `${dayStr}.${month}.${currentYear}`,
                isToday: dayStr === todayStr,
                isTomorrow: dayStr === tomorrowStr
            });
        }
        return urls;
    }

    async function fetchPdf(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentType = response.headers.get('Content-Type');
            return contentType && contentType.includes('application/pdf');
        } catch {
            return false;
        }
    }

    function displayPdfs(urls) {
        showLoading(); // Show loading indicator
        Promise.all(urls.map(pdf => fetchPdf(pdf.url).then(isPdf => ({ ...pdf, exists: isPdf }))))
            .then(results => {
                hideLoading(); // Hide loading indicator
                let hasContent = false;
                results.forEach(pdf => {
                    if (pdf.exists) {
                        hasContent = true;
                        const listItem = document.createElement('li');
                        const link = document.createElement('a');
                        link.href = pdf.url;
                        link.textContent = pdf.date;
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                        link.classList.add('pdf-link');
                        listItem.appendChild(link);

                        if (pdf.isToday) {
                            pdfListSections.today.appendChild(listItem);
                        } else if (pdf.isTomorrow) {
                            pdfListSections.tomorrow.appendChild(listItem);
                        } else {
                            pdfListSections.older.appendChild(listItem);
                        }
                    }
                });

                for (const section in pdfListSections) {
                    if (pdfListSections[section].children.length === 0) {
                        const noContentMessage = document.createElement('li');
                        noContentMessage.textContent = 'Nav pieejama satura';
                        noContentMessage.classList.add('no-content');
                        pdfListSections[section].appendChild(noContentMessage);
                    }
                }

                if (!hasContent) {
                    showWarningPopup();
                }
            })
            .catch(() => {
                hideLoading();
                showWarningPopup();
            });
    }

    function showWarningPopup() {
        if (warningPopup) {
            warningPopup.style.display = 'block';
        }
    }

    function redirectToExtension() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('chrome') > -1) {
            window.open('https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino', '_blank');
        } else if (userAgent.indexOf('firefox') > -1) {
            window.open('https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/', '_blank');
        } else if (userAgent.indexOf('safari') > -1) {
            window.open('https://apps.apple.com/us/app/cors-unblock/id1261417857', '_blank');
        } else {
            alert('Please install a CORS unblock extension for your browser.');
        }
    }

    document.querySelector('.popup button').addEventListener('click', redirectToExtension);

    const urls = generateUrls();
    displayPdfs(urls);
});
