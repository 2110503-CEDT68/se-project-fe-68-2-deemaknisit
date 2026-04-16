/**
 * Utility to bypass aggressive backend URL sanitization by encoding/decoding URLs as hex strings.
 */

const HEX_PREFIX = "hexpt:";

/**
 * Encodes a regular URL string into a hex-prefixed string if it contains problematic characters.
 */
export function encodeSafeUrl(url: string): string {
    if (!url || url.startsWith(HEX_PREFIX)) return url;
    
    // Convert string to hex
    let hex = "";
    for (let i = 0; i < url.length; i++) {
        hex += url.charCodeAt(i).toString(16).padStart(2, "0");
    }
    return HEX_PREFIX + hex;
}

/**
 * Decodes a hex-prefixed string back into a regular URL.
 */
export function decodeSafeUrl(encodedUrl: string): string {
    if (!encodedUrl || !encodedUrl.startsWith(HEX_PREFIX)) return encodedUrl;
    
    const hex = encodedUrl.substring(HEX_PREFIX.length);
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
    }
    return str;
}
