// 显示错误信息
function showErrorMessage(message) {
    document.querySelectorAll('[data-mscpo-mcapi]').forEach(spanElement => {
        spanElement.textContent = message;
    });
}

// 重试逻辑封装
function withRetry(fn, retries, delay) {
    return function() {
        fn().catch(error => {
            if (retries > 0) {
                setTimeout(() => withRetry(fn, retries - 1, delay * 2)(), delay);
            } else {
                showErrorMessage('Failed to fetch data after multiple attempts');
                console.error('API节点异常');
            }
        });
    };
}

// 获取API数据
function fetchApiData(dataKeys = ['motd']) {
    return fetch(`${apiUrl}?${queryParams.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (typeof data !== 'object' || data === null) {
                throw new Error('Invalid data format');
            }
            dataKeys.forEach(key => {
                const spanElement = document.querySelector(`[data-mscpo-mcapi="${key}"]`);
                if (spanElement) {
                    spanElement.textContent = data[key] || 'No data available';
                }
            });
        })
        .catch(error => {
            // 处理fetch API本身的错误
            throw new Error('Failed to fetch data: ' + error.message);
        });
}