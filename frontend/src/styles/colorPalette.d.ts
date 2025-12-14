export declare const COLORS: {
    readonly background: "#F2F1ED";
    readonly burgundy: "#59011A";
    readonly navbar: "#DCC4AC";
};
export declare const background: "#F2F1ED", burgundy: "#59011A", navbar: "#DCC4AC";
export declare const statusConfig: {
    bus: {
        operating: {
            color: string;
            label: string;
            priority: string;
        };
        offline: {
            color: string;
            label: string;
            priority: string;
        };
        maintenance: {
            color: string;
            label: string;
            priority: string;
        };
    };
    driver: {
        active: {
            color: string;
            label: string;
            priority: string;
        };
        passive: {
            color: string;
            label: string;
            priority: string;
        };
    };
    route: {
        covered: {
            color: string;
            label: string;
            priority: string;
        };
        unassigned: {
            color: string;
            label: string;
            priority: string;
        };
    };
    station: {
        covered: {
            color: string;
            label: string;
            priority: string;
        };
        notCovered: {
            color: string;
            label: string;
            priority: string;
        };
    };
};
export type StatusType = 'bus' | 'driver' | 'route' | 'station';
export declare const getStatusConfig: (type: StatusType, status: string) => {
    color: string;
    label: string;
    priority: string;
};
export declare const getStatusColor: (type: StatusType, status: string) => string;
export declare const getStatusLabel: (type: StatusType, status: string) => string;
//# sourceMappingURL=colorPalette.d.ts.map