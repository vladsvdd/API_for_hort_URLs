export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function isAlphanumeric(str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str);
}

export function validateAlias(alias: string): string | null {
    if (!isAlphanumeric(alias)) return 'Alias must be alphanumeric';
    if (alias.length < 4) return 'Alias must be at least 4 characters';
    if (alias.length > 20) return 'Alias must be no more than 20 characters';
    return null;
}