import React, { createContext, useRef,useState} from 'react';
export const PlayerContext = createContext();
function PlayerProvider({ children }) {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    // Store the actual audio element
    const audioElementRef = useRef(null);
    // Current playback queue
    const [queue, setQueue] = useState([]);
    // Current position in queue
    const [currentIndex, setCurrentIndex] = useState(-1);
    // Songs already played
    const [playHistory, setPlayHistory] = useState([]);

    
    // SET AUDIO ELEMENT

    const setAudioElement = (element) => {
        audioElementRef.current = element;

    };

    // SEEK
    
    const seekSong = (time) => {
        const audio = audioElementRef.current;
        if (!audio) {
            return;
        }
        if (!Number.isFinite(time)) {
            return;
        }
        audio.currentTime = time
        setCurrentTime(time);

    };

    // PLAY SONG
    const playSong = (song) => {
        if (!song) {
            return;
        }
        // Same song
        if (
            currentSong &&  Number(currentSong.id) === Number(song.id)
        ) {
            setIsPlaying(true);
            return;
        }
        // Add current song to history
        if (
            currentSong && Number(currentSong.id) !== Number(song.id)
        ) {
            setPlayHistory(previous => {
                if (
                    previous.length > 0 &&
                    Number(
                        previous[previous.length - 1].id
                    ) === Number(currentSong.id)
                ) {
                    return previous;
                }
                return [
                    ...previous,
                    currentSong
                ];
            });
        }
        // Check if song exists in current queue
        const index = queue.findIndex(
            item =>
                Number(item.id) === Number(song.id)
        );
        if (index !== -1) {
            setCurrentIndex(index);
        }
        setCurrentSong(song);
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(true);
    };
    // PLAY SONG FROM QUEUE
    const playSongFromQueue = (song, newQueue) => {
        if (!song ||!newQueue ||newQueue.length === 0) {
            return;
        }
        const updatedQueue = [...newQueue];
        const index = updatedQueue.findIndex(
            item =>
                Number(item.id) === Number(song.id)
        );
        if (index === -1) {
            return;
        }
        // Add current song to history
        if (
            currentSong &&
            Number(currentSong.id) !== Number(song.id)
        ) {
            setPlayHistory(previous => {
                if (
                    previous.length > 0 &&
                    Number(
                        previous[previous.length - 1].id
                    ) === Number(currentSong.id)
                ) {
                    return previous;
                }
                return [
                    ...previous,
                    currentSong
                ];
            });
        }
        setQueue(updatedQueue);
        setCurrentIndex(index);
        setCurrentSong(song);
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(true);
    };
    // PAUSE
    const pauseSong = () => {
        setIsPlaying(false);

    };
    // NEXT SONG
    const nextSong = () => {
        if (!queue || queue.length === 0) {
            return null;
        }
        if (!currentSong) {
            return null;
        }
        const actualCurrentIndex =
            queue.findIndex(
                song =>
                    Number(song.id) ===
                    Number(currentSong.id)
            );
        if (actualCurrentIndex === -1) {
            return null;
        }
        const nextIndex =
            actualCurrentIndex + 1;
        if (nextIndex >= queue.length) {
            return null;
        }
        const next =
            queue[nextIndex];
        setPlayHistory(previous => {
            if (
                previous.length > 0 &&
                Number(
                    previous[previous.length - 1].id
                ) === Number(currentSong.id)
            ) {
                return previous;
            }
            return [
                ...previous,
                currentSong
            ];
        });
        setCurrentSong(next);
        setCurrentIndex(nextIndex);
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(true);
        return next;
    };
    // PREVIOUS SONG

    const previousSong = () => {
        // use playback history
        if (playHistory.length > 0) {
            const previous =
                playHistory[
                    playHistory.length - 1
                ];
            setPlayHistory(history =>
                history.slice(0, -1)
            );
            const index =
                queue.findIndex(
                    song =>
                        Number(song.id) ===
                        Number(previous.id)
                );
            if (index !== -1) {
                setCurrentIndex(index);
            }
            setCurrentSong(previous);
            setCurrentTime(0);
            setDuration(0);
            setIsPlaying(true);
            return previous;
        }
        //  use previous song in queue
        if (
            queue.length > 0 &&
            currentSong
        ) {
            const actualCurrentIndex =
                queue.findIndex(
                    song =>
                        Number(song.id) ===
                        Number(currentSong.id)
                );
            if (actualCurrentIndex > 0) {
                const previous =
                    queue[
                        actualCurrentIndex - 1
                    ];
                setCurrentIndex(
                    actualCurrentIndex - 1
                );
                setCurrentSong(previous);
                setCurrentTime(0);
                setDuration(0);
                setIsPlaying(true);
                return previous;
            }
        }
        return null;
    };
    // CLOSE PLAYER
    const closePlayer = () => {
        const audio =
            audioElementRef.current;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        setCurrentSong(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setQueue([]);
        setCurrentIndex(-1);
        setPlayHistory([]);
    };
    return (
        <PlayerContext.Provider
            value={{ currentSong, isPlaying, currentTime, duration, queue, setQueue,
                currentIndex,playHistory,  playSong,  playSongFromQueue,pauseSong, nextSong,previousSong,  seekSong,setCurrentTime,setDuration,setAudioElement,  closePlayer
            }} >
            {children}
        </PlayerContext.Provider>
    );
}
export default PlayerProvider;