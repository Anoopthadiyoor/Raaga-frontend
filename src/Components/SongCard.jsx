import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FiPlay, FiPause } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { PlayerContext } from '../Context/PlayerContext';

function SongCard({ song, onPlay }) {
    const navigate = useNavigate();
    const {  currentSong,isPlaying,  playSong,pauseSong } = useContext(PlayerContext);

    const CardClick = () => {
        if (onPlay) {
            onPlay(song);
        }
        navigate(`/song/${song.id}`);
    };
    const PlayClick = (event) => {
        event.stopPropagation();
        // Pause current song
        if (currentSong?.id === song.id &&isPlaying)
            {
            pauseSong();
        } else {
            if (onPlay) {
                onPlay(song);
            } else {
                // Normal song playback
                playSong(song);
            }
        }

    };

    const isCurrentSong = currentSong?.id === song.id;

    return (
        <Card
            onClick={CardClick}
            className="song-card-glass text-white"
        >

            <Card.Body className="d-flex align-items-center p-2">
                <Card.Img src={song.coverUrl || null} alt={song.title} style={{ width: '65px', height: '65px', objectFit: 'cover', flexShrink: 0 }} className="rounded-2" />

                <div className="ms-3 flex-grow-1 overflow-hidden">

                    <Card.Title className="mb-1 text-truncate" style={{ fontSize:'15px' }} > {song.title}</Card.Title>
                    <Card.Text className="text-secondary mb-0 text-truncate" style={{fontSize: '13px' }}>{song.artist}</Card.Text>

                </div>

                <Button variant="danger"  onClick={PlayClick} className="rounded-circle d-flex align-items-center justify-content-center p-0" style={{   width: '38px', height: '38px',flexShrink: 0 }}>{isCurrentSong && isPlaying? <FiPause size={17} /> : <FiPlay size={17}/>
                    }
                </Button>
            </Card.Body>
        </Card>
    );
}

export default SongCard;
