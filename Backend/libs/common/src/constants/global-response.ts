export const GlobalResponse = (options: {
    path?: string;
    data?: any;
    statusCode?: number;
    messages?: any[];
}) => {
    if (!Array.isArray(options.messages)) options.messages = [options.messages];
    return (
        process.env.NODE_ENV === 'DEVELOPMENT' ? 
        { ...options, timestamp: Date.now() } : 
        { statusCode: options.statusCode, data: options.data, messages: options.messages }
    )
};