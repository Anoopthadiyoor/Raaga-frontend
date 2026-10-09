import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Spinner } from 'react-bootstrap';
import {  FiPlay,  FiPause, FiHeart, FiPlus, FiSkipBack, FiSkipForward} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { PlayerContext } from '../Context/PlayerContext';
import apiServices from '../Services/apiServices';
import AddToPlaylistModal from '../Components/AddtoPLaylistmodal';
import Header from '../Components/Header';
import BottomNavigation from '../Components/BottomNavigation';

function SongDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [song, setSong] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const { currentSong,  isPlaying,  playSong, pauseSong, currentTime, duration, seekSong, queue, nextSong,previousSong, playSongFromQueue } = useContext(PlayerContext);
    
    useEffect(() => {
    if (!currentSong) {
        return;
    }
    if (Number(currentSong.id) !== Number(id)) {
        navigate(`/song/${currentSong.id}`);
    }
}, [currentSong, id, navigate]);

    // GET CURRENT SONG + ALL SONGS
    useEffect(() => {
        const fetchSongs = async () => {
            setLoading(true);
            try {
            
                const songResponse = await apiServices(  'GET',  `/songs/${id}`  );
                setSong(songResponse.data);
                const songsResponse = await apiServices(   'GET','/songs'  );
                setSongs(songsResponse.data);
            } catch (error) {
                console.log(error);
                setSong(null);
            } 
        };
        fetchSongs();
    }, [id]);

    // CHECK WHETHER SONG IS LIKED
    useEffect(() => {
        const user =  JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setIsLiked(false);
            return;
        }
        apiServices('GET',`/playlists?userId=${user.id}&name=Liked Songs`)
            .then((response) => { const likedPlaylist =   response.data[0];
                if (likedPlaylist) {
                    setIsLiked(  likedPlaylist.songIds.includes( Number(id))
                    );
                } else {
                    setIsLiked(false);
                }
            })
            .catch((error) => {
                 console.log(error);
            });
    }, [id]);

    // LOADING spinner
    if (loading) {
        return (
            <> 
            <Header />
             <div className="text-white text-center mt-5">
                    <Spinner animation="border"variant="danger" />
                </div>
                <BottomNavigation />
            </>
        );
    }
    // SONG NOT FOUND
    if (!song) {
        return (
            <>
                <Header />
                <div className="text-white text-center mt-5"> Song not found </div>
                <BottomNavigation />
            </>
        );
    }
    // CURRENT SONG CHECK
    const isCurrentSong = currentSong && Number(currentSong.id) === Number(song.id);
    // PLAY / PAUSE
    const handlePlay = () => {
        // If this song is currently playing pause it
        if (isCurrentSong && isPlaying) {
            pauseSong();
            return;
        }
        const songExistsInQueue =queue && queue.some(item =>Number(item.id) ===
        Number(song.id) );
        if (songExistsInQueue) {
            playSong(song);
           return;
        }
        if (songs.length > 0) {
            playSongFromQueue(song, songs);
        }
    };
    // NEXT SONG
    const handleNext = () => {
        const songExistsInQueue = queue &&queue.some( item =>  Number(item.id) === Number(song.id)  );
        if (songExistsInQueue) {
            const next = nextSong();
            if (next) {
                navigate(`/song/${next.id}`);
            }
            return;
        }
        const currentIndex =songs.findIndex( item => Number(item.id) === Number(song.id));
        if (  currentIndex === -1 ||currentIndex >= songs.length - 1 ) {
            return;
        }
        const next = songs[currentIndex + 1];
        playSongFromQueue(next, songs);
        navigate(`/song/${next.id}`);
    };

    // PREVIOUS SONG
    const handlePrevious = () => {
        const songExistsInQueue = queue &&queue.some(item =>Number(item.id) === Number(song.id)
            );
        if (songExistsInQueue) {
            const previous = previousSong();
            if (previous) {
                navigate(`/song/${previous.id}`);
            }
            return;
        }
        const currentIndex =
            songs.findIndex(  item => Number(item.id) === Number(song.id)  );
        if (currentIndex <= 0) {return; }
        const previous = songs[currentIndex - 1];
        playSongFromQueue(previous, songs);
        navigate(`/song/${previous.id}`);
    };
    // like /unlike
    const Like = async () => {
        try {
             const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert('Please login first');
                return;
            }
            // Get current user's Liked Songs playlist
            const response = await apiServices( 'GET', `/playlists?userId=${user.id}&name=Liked Songs` );
            const likedPlaylist =response.data[0];
            if (!likedPlaylist) {
                alert('Liked Songs playlist not found');
                return;
            }
            let updatedSongIds;
            if ( likedPlaylist.songIds.includes( Number(id) )
            ) {
                // Remove song
                updatedSongIds =  likedPlaylist.songIds.filter((songId) =>songId !== Number(id) );
                setIsLiked(false);
            } else {
                // Add song
                updatedSongIds = [   ...likedPlaylist.songIds, Number(id)  ];
                setIsLiked(true);
            }
            // Update playlist
            await apiServices('PATCH',  `/playlists/${likedPlaylist.id}`,
                {
                    songIds: updatedSongIds
                }
            );
        } catch (error) {
            console.log(error);
        }
    };
    // FORMAT TIME
    const formatTime = (time) => {
        if (!time || isNaN(time)) {
            return '0:00';
        }
        const minutes =  Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds .toString() .padStart(2, '0')}`;
    };
    // UI
    return (
        <div className="bg-black text-white" style={{ minHeight: '100vh' }}>
            <Header />
            <Container className="text-white pt-3 d-flex justify-content-center" style={{paddingTop: '8px', paddingBottom: '56px', minHeight: 'calc(100dvh - 118px)' }} >
                <Card className="w-100 text-white border rounded-4 my-auto"  style={{ maxWidth: '740px',  background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.24)',  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 20px 55px rgba(0, 0, 0, 0.32), 0 0 34px rgba(220, 53, 69, 0.08), inset 0 1px rgba(255, 255, 255, 0.16)' }}  >

                    <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-2 p-sm-3">
                        <img  src={song.coverUrl} alt={`${song.title} cover`} style={{ width: 'min(235px, 32vh, 60vw)',   height: 'min(235px, 32vh, 60vw)',  aspectRatio: '1 / 1',  objectFit: 'cover',  boxShadow: '0 16px 38px rgba(0, 0, 0, 0.35)'}} className="rounded-3" />

                        <h1 className="h4 fw-bold mt-2 mb-0 text-break"> {song.title} </h1>
                        <p className="text-white-50 mb-2">  {song.artist} </p>
                        <div className="d-flex flex-wrap justify-content-center align-items-center gap-2">

                            <Button variant="light" aria-label="Previous song" className="rounded-circle d-flex align-items-center justify-content-center p-0" style={{ width: '44px', height: '44px', flexShrink: 0, color: '#151515', background: 'rgba(255, 255, 255, 0.94)', border: '1px solid rgba(255, 255, 255, 0.8)' }}
                                onClick={handlePrevious}
                                title="Previous" >  <FiSkipBack size={21} />
                            </Button>

                            <Button  variant="danger"  aria-label={isCurrentSong && isPlaying ? 'Pause song' : 'Play song'}  className="rounded-circle d-flex align-items-center justify-content-center p-0"  style={{ width: '54px', height: '54px', flexShrink: 0, boxShadow: '0 8px 22px rgba(220, 53, 69, 0.34)' }}  onClick={handlePlay} title={isCurrentSong && isPlaying ? 'Pause' : 'Play'} >
                                {isCurrentSong && isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
                            </Button>

                            <Button  variant="light"  aria-label="Next song"  className="rounded-circle d-flex align-items-center justify-content-center p-0" style={{ width: '44px', height: '44px', flexShrink: 0, color: '#151515', background: 'rgba(255, 255, 255, 0.94)', border: '1px solid rgba(255, 255, 255, 0.8)' }}  onClick={handleNext}  title="Next">
                                <FiSkipForward size={21} />
                            </Button>

                            <Button variant={isLiked ? 'danger' : 'light'} aria-label={isLiked ? 'Unlike song' : 'Like song'}   className="rounded-circle d-flex align-items-center justify-content-center p-0"  style={{ width: '44px', height: '44px', flexShrink: 0, color: isLiked ? 'white' : '#151515', background: isLiked ? undefined : 'rgba(255, 255, 255, 0.94)', border: isLiked ? undefined : '1px solid rgba(255, 255, 255, 0.8)' }}
                                onClick={Like}
                                title="Like" > <FiHeart size={21} fill={isLiked ? 'currentColor' : 'none'} />
                            </Button>

                            <Button  variant="light"aria-label="Add to playlist"className="rounded-circle d-flex align-items-center justify-content-center p-0"style={{ width: '44px', height: '44px', flexShrink: 0, color: '#151515', background: 'rgba(255, 255, 255, 0.94)', border: '1px solid rgba(255, 255, 255, 0.8)' }}
                                onClick={() => setShowPlaylistModal(true)} title="Add to playlist"> <FiPlus size={21} />
                            </Button>
                        </div>

                        <div className="mt-2 w-100" style={{ maxWidth: '460px' }}>
                            <input  type="range"  min="0"  max={duration || 0}  value={currentTime}  aria-label="Song playback position" onChange={(event) => seekSong(Number(event.target.value))}   className="form-range mb-1"  style={{ accentColor: '#dc3545' }}
                            />
                            <div className="d-flex justify-content-between text-white-50">
                                <small>{formatTime(currentTime)}</small>
                                <small>{formatTime(duration)}</small>
                            </div>
                        </div>
                        <div className="w-100 mt-2 text-start" style={{ maxWidth: '520px' }}>
                            <h2 className="h6 fw-bold mb-1 text-center">About this track</h2>
                            <div>
                                {[['Movie', song.movie], ['Language', song.language], ['Release year', song.releaseYear], ['Duration', song.duration],   ['Lyricist', song.lyricist] ].map(([label, value]) => (
                                    <div  className="d-flex justify-content-between align-items-center gap-3 py-1 border-bottom border-light border-opacity-10"   key={label}>
                                        <small className="text-white-50 flex-shrink-0">{label}</small>
                                        <span className="small fw-semibold text-end text-break">{value || 'Not available'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <AddToPlaylistModal show={showPlaylistModal} onHide={() => setShowPlaylistModal(false)}   songId={song.id}/>
                    </Card.Body>
                </Card>
            </Container>
            <BottomNavigation />
        </div>
    ); 
}
export default SongDetails;