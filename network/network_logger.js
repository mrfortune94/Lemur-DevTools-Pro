// network_logger.js
// Helper to structure network logs for DevTools UI

export function formatNetworkEvent(info) {
    return {
        url: info.url,
        method: info.method,
        statusCode: info.statusCode,
        ip: info.ip,
        timestamp: Date.now(),
        type: info.type,
        fromCache: info.fromCache,
        initiator: info.initiator,
        requestId: info.requestId,
        tabId: info.tabId
    };
}
