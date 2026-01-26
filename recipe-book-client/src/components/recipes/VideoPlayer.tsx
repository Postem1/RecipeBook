import React from 'react';
import ReactPlayer from 'react-player';

// Workaround for type issues with ReactPlayer in some environments
// @ts-ignore
const ReactPlayerAny = ReactPlayer as any;

interface VideoPlayerProps {
    url: string;
    style?: React.CSSProperties;
    autoPlay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, style, autoPlay }) => {
    // Helper to detect and format embed URLs manually to ensure correct iframe rendering
    const getEmbedInfo = (url: string) => {
        if (!url) return { type: 'unknown', src: '' };

        // YouTube
        const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (ytMatch && ytMatch[1]) {
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            return {
                type: 'youtube',
                src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=${autoPlay ? 1 : 0}&rel=0&origin=${origin}&playsinline=1&modestbranding=1`
            };
        }

        // Vimeo
        const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
        if (vimeoMatch && vimeoMatch[1]) {
            return { type: 'vimeo', src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${autoPlay ? 1 : 0}` };
        }

        // Direct Video Files (Supabase or generic extensions)
        if (url.includes('supabase.co') || url.match(/\.(mp4|webm|ogg|mov)$/i)) {
            return { type: 'file', src: url };
        }

        return { type: 'other', src: url };
    };

    const embedInfo = getEmbedInfo(url);

    return (
        <div className="video-player-container" style={{ ...style, position: 'relative', paddingTop: '56.25%', backgroundColor: '#000', overflow: 'hidden' }}>
            {embedInfo.type === 'youtube' || embedInfo.type === 'vimeo' ? (
                <iframe
                    src={embedInfo.src}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    title={`${embedInfo.type} video player`}
                />
            ) : embedInfo.type === 'file' ? (
                <video
                    src={embedInfo.src}
                    controls
                    autoPlay={autoPlay}
                    playsInline
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                />
            ) : (
                <ReactPlayerAny
                    url={url}
                    playing={autoPlay}
                    controls
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                />
            )}
        </div>
    );
};

export default VideoPlayer;
