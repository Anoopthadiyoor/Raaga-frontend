import React, { useEffect, useState, useContext } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';

import SongCard from '../Components/SongCard';
import Header from '../Components/Header';
import BottomNavigation from '../Components/BottomNavigation';
import apiServices from '../Services/apiServices';
import { PlayerContext } from '../Context/PlayerContext';

function Playlist() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { playSongFromQueue } = useContext(PlayerContext);

    const [playlist, setPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    navigate('/login');
                    return;
                }
                // Get playlist
                const playlistResponse = await apiServices(
                    'GET',
                    `/playlists/${id}`
                );
                const playlistData = playlistResponse.data;
                // Check playlist belongs to logged-in user
                if (Number(playlistData.userId) !== Number(user.id)) {
                    setPlaylist(null);
                    return;
                }
                setPlaylist(playlistData);
                // Get songs
                const songsResponse = await apiServices(
                    'GET',
                    '/songs'
                );
                const playlistSongs = songsResponse.data.filter(
                    (song) =>
                        playlistData.songIds.includes(Number(song.id))
                );
                setSongs(playlistSongs);
            } catch (error) {
                console.log(error);

            } finally {
                setLoading(false);

            }
        };
        fetchPlaylist();
    }, [id, navigate]);

    // Play a song using this playlist as the queue
    const handlePlaySong = (song) => {

        playSongFromQueue(song, songs);

    };

    // Remove a song from this playlist
    const handleRemoveSong = async (songId) => {
        try {

            const updatedSongIds = playlist.songIds.filter(
                (id) => Number(id) !== Number(songId)
            );

            // Update playlist in JSON Server
            await apiServices(
                'PATCH',
                `/playlists/${playlist.id}`,
                {
                    songIds: updatedSongIds
                }
            );

            // Update playlist state
            setPlaylist((currentPlaylist) => ({
                ...currentPlaylist,
                songIds: updatedSongIds
            }));

            // Remove song from the displayed songs
            setSongs((currentSongs) =>
                currentSongs.filter(
                    (song) => Number(song.id) !== Number(songId)
                )
            );
        } catch (error) {
            console.log(error);
            alert('Could not remove the song. Please try again.');

        }
    };
    if (loading) {

        return (
            <>
                <Header />

                <div   className="bg-black text-white text-center pt-5"   style={{ minHeight: '80vh' }} >
                    <Spinner animation="border" variant="danger" />
                </div>
                <BottomNavigation />
            </>
        );
    }
    if (!playlist) {
        return (
            <>
                <Header />
                <div  className="bg-black text-white text-center pt-5" style={{ minHeight: '80vh' }}  >
                    <h4>Playlist not found</h4>
                </div>
                <BottomNavigation />
            </>
        );
    }
    return (
        <div className="bg-black text-white"  style={{ minHeight: '100vh' }} >
            <Header />
            <Container  className="pt-4" style={{ paddingBottom: '220px' }} >
                <h2 className="mb-1">    {playlist.name} </h2>
                <p className="text-secondary mb-4">    {songs.length} songs  </p>
                {songs.length === 0 ? (
                    <p className="text-secondary"> No songs in this playlist. </p>
                ) : (
                    <div className="d-flex flex-column gap-2">
                        {songs.map((song) => (
                            <div  key={song.id}  className="d-flex align-items-center gap-2">
                                <div className="flex-grow-1">
                                    <SongCard  song={song}  onPlay={() => handlePlaySong(song)}   />
                                </div>
                                <button   type="button"   className="btn btn-link text-secondary p-1" title="Remove from playlist" onClick={() => handleRemoveSong(song.id)}  >  <FiTrash2 size={17} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
            <BottomNavigation />
        </div>
    );
}

export default Playlist;