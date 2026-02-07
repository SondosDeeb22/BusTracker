//===================================================================================================
//? Color helper
//===================================================================================================
// default fallback value
export const DEFAULT_ROUTE_COLOR_ARGB = 0xff9e9e9e;


// function to normalize color from string to ARGB integer 
// accepts:
// - RRGGBB
// - AARRGGBB
// - RRGGBBAA (convert to AARRGGBB)
export const normalizeColorToArgbInt = (input: unknown): number => {
    if (typeof input !== 'string') {
        return DEFAULT_ROUTE_COLOR_ARGB;
    }

    let cleaned = input.trim();
    if (!cleaned) {
        return DEFAULT_ROUTE_COLOR_ARGB;
    }

    if (cleaned.startsWith('#')) {
        cleaned = cleaned.substring(1);
    }

    // If only 6 digits, add alpha channel (fully opaque)
    if (cleaned.length === 6) {
        cleaned = `FF${cleaned}`;
    
    // If 8 digits, convert RGBA to ARGB
    } else if (cleaned.length === 8) {
        const rgba = cleaned;
        cleaned = `${rgba.substring(6, 8)}${rgba.substring(0, 6)}`;
    
    } else {
        return DEFAULT_ROUTE_COLOR_ARGB;
    }

    const value = Number.parseInt(cleaned, 16);
    if (Number.isNaN(value)) {
        return DEFAULT_ROUTE_COLOR_ARGB;
    }

    // Convert value to unsigned 32-bit integer (">>>" is the unsigned right shift operator)
    return value >>> 0;
};
