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

    // Generate the URL pattern with suffixes (_1, _2, etc.)
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
            // Generate URL without version suffix
            urls.push({
                url: `${basePath}Izm_${dayStr}_${month}_${currentYear}.pdf`,
                date: `${dayStr}.${month}.${currentYear}`,
                isToday: dayStr === todayStr,
                isTomorrow: dayStr === tomorrowStr,
                version: 0
            });

            // Generate URLs with version suffixes (_1, _2, etc.)
            for (let suffix = 1; suffix <= 10; suffix++) {
                urls.push({
                    url: `${basePath}Izm_${dayStr}_${month}_${currentYear}_${suffix}.pdf`,
                    date: `${dayStr}.${month}.${currentYear}`,
                    isToday: dayStr === todayStr,
                    isTomorrow: dayStr === tomorrowStr,
                    version: suffix
                });
            }
        }
        return urls;
    }

    // Fetch and check if the file is a PDF
    async function fetchPdf(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentType = response.headers.get('Content-Type');
            return contentType && contentType.includes('application/pdf');
        } catch {
            return false;
        }
    }

    // Display only the latest version of each PDF
    function displayPdfs(urls) {
        showLoading(); // Show loading indicator
        const latestPdfs = {};

        Promise.all(urls.map(pdf => fetchPdf(pdf.url).then(isPdf => ({ ...pdf, exists: isPdf }))))
            .then(results => {
                hideLoading(); // Hide loading indicator
                let hasContent = false;

                results.forEach(pdf => {
                    if (pdf.exists) {
                        hasContent = true;

                        // Group PDFs by base date (ignore version number)
                        const baseDate = pdf.date;

                        // Only store the latest version of the PDF
                        if (!latestPdfs[baseDate] || pdf.version > latestPdfs[baseDate].version) {
                            latestPdfs[baseDate] = pdf;
                        }
                    }
                });

                // Display the latest versions of the PDFs
                Object.values(latestPdfs).forEach(pdf => {
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
                });

                // Show no content message if needed
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

    // Show warning popup
    function showWarningPopup() {
        if (warningPopup) {
            warningPopup.style.display = 'block';
        }
    }

    // Redirect to extension page
    function redirectToExtension() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('chrome') > -1) {
            window.open('https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino', '_blank');
        } else if (userAgent.indexOf('firefox') > -1) {
            window.open('https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/', '_blank');
        } else if (userAgent.indexOf('safari') > -1) {
            window.open('https://apps.apple.com/us/app/cors-unblock/id1261417857', '_blank');
        } else {
            alert('Lūdzu instalējiet CORS atbloķēšanas paplašinājumu savam pārlūkam.');
        }
    }

    document.querySelector('.popup button').addEventListener('click', redirectToExtension);

    // Execute
    const urls = generateUrls();
    displayPdfs(urls);
});
