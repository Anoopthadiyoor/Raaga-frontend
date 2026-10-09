import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import apiServices from '../Services/apiServices';

function AddToPlaylistModal({ show, onHide, songId }) {

    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');

    useEffect(() => {

        if (!show) {
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            setPlaylists([]);
            return;
        }

        apiServices('GET', `/playlists?userId=${user.id}`)
            .then((response) => {

                const normalPlaylists = response.data.filter(
                    (playlist) => playlist.name !== 'Liked Songs'
                );

                setPlaylists(normalPlaylists);

            })
            .catch((error) => {
                console.log(error);
            });

    }, [show]);


    const handleAdd = async () => {

        if (!selectedPlaylist) {
            return;
        }

        try {

            const response = await apiServices(
                'GET',
                `/playlists/${selectedPlaylist}`
            );

            const playlist = response.data;

            if (playlist.songIds.includes(Number(songId))) {

                alert('Song is already in this playlist');
                return;

            }

            const updatedSongIds = [
                ...playlist.songIds,
                Number(songId)
            ];

            await apiServices(
                'PATCH',
                `/playlists/${selectedPlaylist}`,
                {
                    songIds: updatedSongIds
                }
            );

            alert('Song added to playlist');

            setSelectedPlaylist('');
            onHide();

        } catch (error) {

            console.log(error);

        }
    };


    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            contentClassName="bg-dark text-white"
        >

            <Modal.Header closeButton>
                <Modal.Title>
                    Add to Playlist
                </Modal.Title>
            </Modal.Header>


            <Modal.Body>
                {playlists.length === 0 ? (
                    <p className="text-secondary">
                        No playlists available.
                    </p>
                ) : (
                    <Form.Select   value={selectedPlaylist}   onChange={(event) =>
                            setSelectedPlaylist(event.target.value)
                        }
                        className="bg-dark text-white"
                    >

                        <option value="">
                            Select a playlist
                        </option>

                        {playlists.map((playlist) => (

                            <option
                                key={playlist.id}
                                value={playlist.id}
                            >
                                {playlist.name}
                            </option>

                        ))}

                    </Form.Select>

                )}

            </Modal.Body>


            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={onHide}
                >
                    Cancel
                </Button>

                <Button
                    variant="danger"
                    onClick={handleAdd}
                    disabled={!selectedPlaylist}
                >
                    Add
                </Button>

            </Modal.Footer>

        </Modal>
    );
}

export default AddToPlaylistModal;