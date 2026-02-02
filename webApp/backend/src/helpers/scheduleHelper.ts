
export class ScheduleHelper {
    
    //===================================================================================================
    // Normalize time
    //===================================================================================================
    normalizeTime(value: unknown): string {
        if (!value) return '';

        const s = String(value).trim();
        if (!s) return '';

        const parts = s.split(':');
        const hh = (parts[0] ?? '00').padStart(2, '0');
        const mm = (parts[1] ?? '00').padStart(2, '0');
        const ss = (parts[2] ?? '00').padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
    };

    //===================================================================================================
    // Calculate day from date
    //===================================================================================================
    calcDayFromDate(dateStr: string): string {
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return '';

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[d.getDay()] ?? '';
    };

    //===================================================================================================
    // Normalize day key for grouping 
    //===================================================================================================
    normalizeDayKey(value: unknown): string {
        const raw = String(value ?? '')
            .trim()
            .toLowerCase();

        switch (raw) {
            case 'monday':
                return 'monday';
            case 'tuesday':
                return 'tuesday';
            case 'wednesday':
            case 'wedensday':
                return 'wednesday';
            case 'thursday':
                return 'thursday';
            case 'friday':
                return 'friday';
            case 'saturday':
                return 'saturday';
            case 'sunday':
                return 'sunday';
            default:
                return raw;
        }
    };


    //===================================================================================================
    // Format date for mobile UI
    //===================================================================================================
    formatDateForMobileUi(value: unknown): string{
        const s = String(value ?? '').trim();
        const d = new Date(s);
        if (Number.isNaN(d.getTime())) return s;

        const two = (v: number) => String(v).padStart(2, '0');
        return `${two(d.getDate())}/${two(d.getMonth() + 1)}/${d.getFullYear()}`;
    };

    //===================================================================================================
    // Normalize time to hour:minute format
    //===================================================================================================
    normalizeTimeToHourMinute(value: unknown): string{
        const t = this.normalizeTime(value);
        if (!t) return '';
        const parts = t.split(':');``
        const hh = (parts[0] ?? '00').padStart(2, '0');
        const mm = (parts[1] ?? '00').padStart(2, '0');
        return `${hh}:${mm}`;
    };

    //===================================================================================================
    // Parse color to ARGB int
    //===================================================================================================
    parseColorToArgbInt(raw: unknown): number{
        const s = String(raw ?? '').trim();
        const hex = s.startsWith('#') ? s.slice(1) : s;
        if (!/^[0-9a-fA-F]{6}$/.test(hex)) return 0xFF9E9E9E;
        return (0xFF000000 | parseInt(hex, 16)) >>> 0;
    };

}

//===================================================================================================