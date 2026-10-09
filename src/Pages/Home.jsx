import React, { useEffect, useState } from 'react';
import apiServices from '../Services/apiServices';
import { Container } from 'react-bootstrap';
import SongSelection from '../Components/SongSelection';
import Header from '../Components/Header';
import BottomNavigation from '../Components/BottomNavigation';

function Home() {

    const [songs, setSongs] = useState([]);
    useEffect(() => {

    apiServices('GET', '/songs').then((response) => {  setSongs(response.data); })
        .catch((error) => {
            console.log(error);
        });

}, []);
    return (<>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 72px)', background: 'radial-gradient(circle at 90% 0%, rgba(220, 53, 69, 0.16), transparent 32%), #101010',  color: '#fff'  }} >
         <Container className="py-4" style={{ paddingBottom: '220px' }}>
                <SongSelection title="Quick Picks" songs={songs.slice(0,5)} />
                <SongSelection title="Beat Street" songs={songs.slice(6,9)} />
                <SongSelection title="More to Explore" songs={songs.slice(3,6)} />
            </Container>
        </main>
        <BottomNavigation />
        </>
    );
}

export default Home;