import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

export const PageLoader = () => {
    const location = useLocation();

    useEffect(() => {
        NProgress.start();
        // Use a small timeout so the bar is visible even on fast navigations
        const timer = setTimeout(() => {
            NProgress.done();
        }, 300);

        return () => {
            clearTimeout(timer);
            NProgress.done();
        };
    }, [location.pathname]);

    return null;
};
