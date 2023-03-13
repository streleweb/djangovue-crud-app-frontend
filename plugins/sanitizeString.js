export default (context, inject) => {
    const sanitizeString = function sanitizeString(str) {
        str = str.replace(/[^a-z0-9áéíóúñü \\.,_-]/gim, "");
        return str.trim();
    }
    // Inject $hello(msg) in Vue, context and store.
    inject('sanitizeString', sanitizeString)

}