import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Partitions.css';
import logo_partition from '../assets/logo_partition.png';
import {useEffect, useState} from 'react';
import {getAllPartitions} from '../service/partitionsServiceFront';

function Partitions() {
    const [partitions, setPartitions] = useState([]);
    const [selectedPdf, setSelectedPdf] = useState(null);

    useEffect(() => {
        getAllPartitions()
            .then(setPartitions)
            .catch(error => console.error('Erreur récupération des partitions :', error));
    }, []);

    return (
        <div className="page">
            <Header />
            <main className="page__content">
                <h1 className="page__title">Partitions</h1>

                <div className="grid partition__grid">
                    {partitions.map((partition) => (
                        <div
                            key={partition.id}
                            className="card partition__card__tile"
                            onClick={() => setSelectedPdf(partition)}
                        >
                            <img src={logo_partition} alt={partition.title} />
                            <p>{partition.title}</p>
                        </div>
                    ))}
                </div>

                {selectedPdf && (
                    <div className="partition__modal" onClick={() => setSelectedPdf(null)}>
                        <div
                            className="partition__modal__content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>{selectedPdf.title}</h2>

                            <iframe
                                src={selectedPdf.url}
                                title="PDF preview"
                            />

                            <a
                                href={selectedPdf.url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn"
                            >
                                Ouvrir en plein écran
                            </a>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default Partitions;
