import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';
import { PageProps as AppPageProps } from './';

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    /* eslint-disable no-var */
    var route: typeof ziggyRoute;

    namespace JSX {
        interface IntrinsicElements {
            'iconify-icon': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    icon: string;
                    width?: string | number;
                    height?: string | number;
                    inline?: boolean;
                    style?: React.CSSProperties;
                    class?: string;
                    className?: string;
                },
                HTMLElement
            >;
        }
    }
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}
