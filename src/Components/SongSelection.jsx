import React, { useContext } from 'react';
import SongCard from './SongCard';
import { PlayerContext } from '../Context/PlayerContext';

function SongSection({ title, songs }) {

    const { playSongFromQueue } = useContext(PlayerContext);

    const handlePlaySong = (song) => {
        playSongFromQueue(song, songs);
    };

    return (
        <section className="mb-4">
            <h3 className="text-white fw-bold mb-3"> {title} </h3>
            <div className="d-flex flex-column gap-2">
                {songs.map((song) => (
                    <SongCard key={song.id}  song={song} onPlay={handlePlaySong}/>
                ))}
            </div>

        </section>
    );
}

export default SongSection;