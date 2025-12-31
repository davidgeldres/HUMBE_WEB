import { useEffect, useRef } from 'react';

export function SpotifyPlayer({ song, isApiReady, onNext, onControllerReady }) {
    const containerRef = useRef(null);
    const controllerRef = useRef(null);

    // Helper to extract Spotify ID
    const getSpotifyId = (url) => {
        if (!url) return '';
        const match = url.match(/\/track\/([a-zA-Z0-9]+)/);
        return match ? match[1] : '';
    };

    useEffect(() => {
        if (!isApiReady || !song || !containerRef.current || !window.SpotifyIFrameAPI) return;

        // Clean up previous controller if exists
        // Note: The API doesn't explicitly provide a destroy method, 
        // but re-creating it handles the swap. We just reset our ref.
        controllerRef.current = null;

        const container = containerRef.current;
        container.innerHTML = ''; // Clear previous iframe to be safe

        const options = {
            uri: `spotify:track:${getSpotifyId(song.spotifyEmbedUrl)}`,
            width: '100%',
            height: '80',
            theme: 'dark'
        };

        const callback = (EmbedController) => {
            controllerRef.current = EmbedController;
            if (onControllerReady) {
                onControllerReady(EmbedController);
            }

            EmbedController.addListener('playback_update', (e) => {
                const { duration, position, isPaused } = e.data;
                // Auto-advance logic: if song is near end (1s left) and paused (ended)
                if (duration > 0 && position >= duration - 1000 && isPaused) {
                    onNext();
                }
            });

            EmbedController.play();
        };

        window.SpotifyIFrameAPI.createController(container, options, callback);

    }, [song.id, isApiReady]); // Only re-run if song ID changes or API becomes ready

    return (
        <div className="w-full h-full" ref={containerRef} />
    );
}
