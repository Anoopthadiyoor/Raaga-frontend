import React, { useContext, useEffect, useRef} from 'react';
import { PlayerContext } from '../Context/PlayerContext';
import {  useLocation, useNavigate} from 'react-router-dom';
import { FiX, FiSkipBack, FiSkipForward, FiPlay, FiPause} from 'react-icons/fi';

function MusicPlayer() {

    const {  currentSong,isPlaying,playSong,pauseSong,  currentTime,   duration,setCurrentTime,  setDuration,  setAudioElement,  seekSong,closePlayer , nextSong,previousSong
    } = useContext(PlayerContext);

    const audioRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    
    // PAGE CHECKS
    const isSongPage =
        location.pathname.startsWith('/song/');
    const isAuthPage =
        location.pathname === '/login' ||
        location.pathname === '/register' ||
        location.pathname === '/admin-login' ||
        location.pathname === '/admin/login';

    // REGISTER AUDIO ELEMENT
    useEffect(() => {

        if (audioRef.current) {

            setAudioElement(
                audioRef.current
            );

        }
        return () => {

            setAudioElement(null);

        };

    }, [setAudioElement]);

    // PLAY / PAUSE

    useEffect(() => {

        const audio = audioRef.current;

        if (
            !currentSong ||
            !currentSong.audioUrl ||
            !audio
        ) {

            return;
        }
        if (isPlaying) {
            audio.play().catch(error => {
                console.log(
                    'Audio play error:',
                    error
                );

            });

        } else {

            audio.pause();

        }

    }, [
        currentSong,
        isPlaying
    ]);



    // STOP ON AUTH PAGE

    useEffect(() => {

        if (
            isAuthPage &&
            currentSong
        ) {
            closePlayer();

        }
    }, [
        isAuthPage,
        currentSong,
        closePlayer
    ]);

    // SONG END
    const handleSongEnd = () => {

        const next = nextSong();
        if (!next) {
            pauseSong();

        }

    };

    // OPEN SONG DETAILS
    const handleSongClick = () => {
        if (!currentSong) {
            return;
        }
        navigate( `/song/${currentSong.id}`
        );
    };

    // NO SONG
    if (!currentSong) {
        return null;

    }
    return (

        <>
            <audio ref={audioRef}  src={ currentSong.audioUrl ||undefined   }
                onTimeUpdate={() => {
                    const audio =  audioRef.current;
                    if (audio) {
                        setCurrentTime(
                            audio.currentTime
                        );

                    }

                }}
                onLoadedMetadata={() => {
                    const audio = audioRef.current;
                    if (
                        audio &&
                        Number.isFinite(
                            audio.duration
                        )
                    ) {
                        setDuration(
                            audio.duration
                        );
                    }
                }}
                onEnded={handleSongEnd}
            />

            {!isSongPage &&
                !isAuthPage && (

                    <div className="mini-player text-white">
                        <div className="container">
                            <div className="d-flex align-items-center">
                                {/* SONG INFORMATION */}
                                <div
                                    className="d-flex align-items-center flex-grow-1 overflow-hidden"
                                    onClick={  handleSongClick}
                                    style={{cursor: 'pointer',
                                        minWidth: 0
                                    }}
                                    title="Open song"
                                >
                                    <img src={
                                    currentSong.coverUrl
                                        }
                                        alt={
                                            currentSong.title
                                        }
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover'
                                        }}
                                        className="rounded"
                                    />


                                    <div className="ms-3 flex-grow-1 overflow-hidden">

                                        <div className="text-truncate">

                                            {
                                                currentSong.title
                                            }

                                        </div>


                                        <small className="text-secondary text-truncate d-block">

                                            {
                                                currentSong.artist
                                            }

                                        </small>


                                        {/* PROGRESS */}

                                        <input
                                            type="range"

                                            min="0"

                                            max={
                                                duration > 0
                                                    ? duration
                                                    : 0
                                            }

                                            value={
                                                duration > 0
                                                    ? Math.min(
                                                        currentTime,
                                                        duration
                                                    )
                                                    : 0
                                            }

                                            onClick={event => {

                                                event.stopPropagation();

                                            }}

                                            onChange={event => {

                                                event.stopPropagation();

                                                const newTime =
                                                    Number(
                                                        event.target.value
                                                    );

                                                seekSong(
                                                    newTime
                                                );

                                            }}

                                            className="form-range"
                                        />

                                    </div>

                                </div>


                                {/* PREVIOUS */}

                                <button
                                    className="btn btn-outline-light rounded-circle ms-2 d-flex align-items-center justify-content-center"

                                    onClick={() => {

                                        previousSong();

                                    }}

                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        padding: 0
                                    }}

                                    title="Previous"
                                >

                                    <FiSkipBack
                                        size={17}
                                    />

                                </button>


                                {/* PLAY / PAUSE */}

                                <button
                                    className="btn btn-danger rounded-circle ms-2 d-flex align-items-center justify-content-center"

                                    onClick={() => {

                                        if (isPlaying) {

                                            pauseSong();

                                        } else {

                                            playSong(
                                                currentSong
                                            );

                                        }

                                    }}

                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        padding: 0
                                    }}

                                    title={
                                        isPlaying
                                            ? 'Pause'
                                            : 'Play'
                                    }
                                >

                                    {isPlaying ? (

                                        <FiPause
                                            size={18}
                                        />

                                    ) : (

                                        <FiPlay
                                            size={18}
                                        />

                                    )}

                                </button>


                                {/* NEXT */}

                                <button
                                    className="btn btn-outline-light rounded-circle ms-2 d-flex align-items-center justify-content-center"

                                    onClick={() => {

                                        nextSong();

                                    }}

                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        padding: 0
                                    }}

                                    title="Next"
                                >

                                    <FiSkipForward
                                        size={17}
                                    />

                                </button>


                                {/* CLOSE */}

                                <button
                                    className="btn btn-outline-light ms-2 rounded-circle d-flex align-items-center justify-content-center"

                                    onClick={() => {

                                        closePlayer();

                                    }}

                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        padding: 0
                                    }}

                                    title="Close player"
                                >

                                    <FiX
                                        size={20}
                                    />

                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </>

    );

}

export default MusicPlayer;