import React, { useEffect, useState } from 'react';
import {  Button,  Card,  Container, Form, Modal, Spinner} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import apiServices from '../Services/apiServices';
import Header from '../Components/Header';
import BottomNavigation from '../Components/BottomNavigation';

function Library() {
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
    const navigate = useNavigate();
    // FETCH USER PLAYLISTS
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setLoading(false);
            return;
        }
        Promise.all([
            apiServices('GET', `/playlists?userId=${user.id}`),
            apiServices('GET', '/songs')
        ])
            .then(([playlistResponse, songResponse]) => {

                setPlaylists(playlistResponse.data);
                setSongs(songResponse.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);

            });
    }, []);
    // CREATE PLAYLIST
    const handleCreatePlaylist = async (event) => {
        event.preventDefault();
        const name = playlistName.trim();
        if (!name) {
            return;
        }
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please login first.');
            return;
        }
        setIsCreatingPlaylist(true);
        try {
            const response = await apiServices('POST', '/playlists',{userId: user.id,  name: name, songIds: [] }  );
            setPlaylists((currentPlaylists) => [ ...currentPlaylists, response.data ]);
            setPlaylistName('');
            setShowCreateModal(false);
        } catch (error) {
            console.log(error);
            alert(
                'Could not create playlist. Please try again.'
            );

        } finally {
            setIsCreatingPlaylist(false);

        }
    };
    // DELETE PLAYLIST
    const handleDeletePlaylist = async ( playlistId, playlistName) => {
        // Prevent deleting Liked Songs
        if (playlistName === 'Liked Songs') {
            return;
        }
        const confirmed = window.confirm(
            `Are you sure you want to delete "${playlistName}"?`
        );
        if (!confirmed) {
            return;
        }
        try {
            await apiServices( 'DELETE',  `/playlists/${playlistId}` );
            // Remove the deleted playlist from the UI
            setPlaylists((currentPlaylists) =>
                currentPlaylists.filter(
                    (playlist) =>
                        playlist.id !== playlistId
                )
            );
        } catch (error) {
            console.log(error);
            alert( 'Could not delete playlist. Please try again.'  );
        }
    };
    // LOADING STATE
    if (loading) {
        return (
            <>
                <Header />
                <div className="text-white text-center mt-5">
                    <Spinner animation="border" variant="danger"   />
                </div>
                <BottomNavigation />
            </>
        );
    }
    return (
        <div className="bg-black text-white"  style={{   minHeight: '100vh'}}>
            <Header />
            <Container  className="text-white pt-4"   style={{  paddingBottom: '220px'   }} >
                {/* PAGE HEADER */}
                <div   className="d-flex justify-content-between align-items-center mb-4"   >
                    <div>
                        <p className="text-danger fw-bold text-uppercase mb-1">  Your collection</p>
                        <h1 className="h2 fw-bold mb-0">
                            Your Library
                        </h1>
                    </div>
                    <Button
                        variant="danger"
                        className="rounded-2"
                        onClick={() =>
                            setShowCreateModal(true)
                        }
                    >
                        + Create Playlist
                    </Button>
                </div>

                {/* PLAYLIST CARDS */}

                <div className="row g-3">
                    {playlists.map((playlist) => {
                        const songCount = songs.filter((song) =>
                            playlist.songIds.includes(Number(song.id))
                        ).length;
                        return (
                        <div
                            className="col-12 col-md-6 col-lg-4"
                            key={playlist.id}
                        >
                            <Card
                                className="h-100 text-white border rounded-3 position-relative"
                                style={{
                                    cursor: 'pointer',
                                    background:
                                        'linear-gradient(140deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.055))',
                                    borderColor:
                                        'rgba(255, 255, 255, 0.2)',
                                    backdropFilter:
                                        'blur(16px)',
                                    WebkitBackdropFilter:
                                        'blur(16px)',
                                    boxShadow:
                                        '0 12px 30px rgba(0, 0, 0, 0.2)'
                                }}
                                onClick={() =>
                                    navigate(
                                        `/playlist/${playlist.id}`
                                    ) }>
                                <Card.Body  className="d-flex flex-column justify-content-center p-4 position-relative" >
                                    {/* DELETE ICON */}
                                    {playlist.name !== 'Liked Songs' && (
                                        <button   type="button" className="btn text-secondary position-absolute top-0 end-0 m-2 p-1"
                                            style={{     border: 'none',   background: 'transparent' }}
                                            title="Delete playlist"
                                            onClick={(event) => {
                                                // Prevent card navigation
                                                event.stopPropagation();

                                                handleDeletePlaylist(
                                                    playlist.id,
                                                    playlist.name
                                                );

                                            }}>
                                            <FiTrash2 size={16} />
                                        </button>
                                    )}
                                    {/* PLAYLIST LABEL */}

                                    <p className="text-danger fw-bold text-uppercase small mb-2">
                                        Playlist
                                    </p>

                                    {/* PLAYLIST NAME */}

                                    <Card.Title
                                        className="fw-bold mb-2 text-break"
                                    >
                                        {playlist.name}
                                    </Card.Title>
                                    {/* SONG COUNT */}
                                    <Card.Text
                                        className="text-white-50 mb-0"
                                    >
                                        {songCount}{' '}

                                        {songCount === 1
                                            ? 'song'
                                            : 'songs'}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>

                        );
                    })}

                </div>
                {/* EMPTY LIBRARY */}
                {playlists.length === 0 && (
                    <Card
                        className="text-white border rounded-3 mt-4"
                        style={{
                            background:
                                'rgba(255, 255, 255, 0.07)',
                            borderColor:
                                'rgba(255, 255, 255, 0.16)',
                            backdropFilter:
                                'blur(14px)'
                        }}
                    >
                        <Card.Body
                            className="text-center py-5 text-white-50"
                        >
                            You don't have any playlists yet.
                        </Card.Body>
                    </Card>
                )}
            </Container>

            {/* BOTTOM NAVIGATION */}
            <BottomNavigation />
            {/* CREATE PLAYLIST MODAL */}

            <Modal
                show={showCreateModal}
                onHide={() =>
                    setShowCreateModal(false)
                }
                centered
                contentClassName="bg-dark text-white"
            >
                <Form onSubmit={handleCreatePlaylist}>

                    <Modal.Header closeButton>

                        <Modal.Title>
                            Create Playlist
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control
                            type="text"
                            placeholder="Playlist name"
                            value={playlistName}
                            onChange={(event) =>
                                setPlaylistName(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            type="button"

                            onClick={() =>
                                setShowCreateModal(false)
                            } >
                            Cancel
                        </Button>
                        <Button variant="danger"   type="submit" disabled={ isCreatingPlaylist ||  !playlistName.trim()
                            } > {isCreatingPlaylist  ? 'Creating...'    : 'Create Playlist'} </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
export default Library;