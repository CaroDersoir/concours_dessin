// Page partitions — affichage, ajout (utilisateur connecté) et suppression (admin)
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Partitions.css';
import logo_partition from '../assets/logo_partition.png';
import {useEffect, useState, useContext, useMemo} from 'react';
import {getAllPartitions, uploadPartition, deletePartition} from '../service/partitionsServiceFront';
import {getProfile} from '../service/customerServiceFront';
import {LanguageContext} from '../context/languageContext';

const INSTRUMENTS = ['piano', 'guitare', 'saxophone', 'batterie', 'voix', 'basse', 'violon', 'violoncelle', 'trompette', 'tutti'];

function Partitions() {
    const {t} = useContext(LanguageContext);
    const [partitions, setPartitions] = useState([]);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadAuthor, setUploadAuthor] = useState('');
    const [uploadInstrument, setUploadInstrument] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [canUpload, setCanUpload] = useState(false);
    const [filterMode, setFilterMode] = useState('none'); // 'none' | 'author' | 'instrument'
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const isLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        getAllPartitions()
            .then(setPartitions)
            .catch(error => console.error('Erreur récupération des partitions :', error));

        if (isLoggedIn) {
            getProfile()
                .then(user => setCanUpload(!!user.can_upload_partition))
                .catch(() => {});
        }
    }, []);

    const groupIndex = useMemo(() => {
        if (filterMode === 'none') return [];
        const unknown = t('partitions_unknown');
        const keys = partitions.map(p =>
            filterMode === 'author' ? (p.author || unknown) : (p.instrument || unknown)
        );
        return [...new Set(keys)].sort((a, b) => a.localeCompare(b));
    }, [partitions, filterMode, t]);

    const displayedPartitions = useMemo(() => {
        const unknown = t('partitions_unknown');
        let list = [...partitions];

        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter(p =>
                p.title.toLowerCase().includes(q) ||
                (p.author || '').toLowerCase().includes(q) ||
                (p.instrument || '').toLowerCase().includes(q)
            );
        }

        if (filterMode !== 'none' && selectedGroup) {
            list = list.filter(p => {
                const key = filterMode === 'author' ? (p.author || unknown) : (p.instrument || unknown);
                return key === selectedGroup;
            });
        }

        return list.sort((a, b) => a.title.localeCompare(b.title));
    }, [partitions, searchQuery, filterMode, selectedGroup, t]);

    function toggleFilter(mode) {
        if (filterMode === mode) {
            setFilterMode('none');
            setSelectedGroup(null);
        } else {
            setFilterMode(mode);
            setSelectedGroup(null);
        }
    }

    async function handleUpload(e) {
        e.preventDefault();
        if (!uploadFile) return;
        setUploadError('');
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('title', uploadTitle);
        formData.append('author', uploadAuthor);
        formData.append('instrument', uploadInstrument);
        try {
            const newPartition = await uploadPartition(formData);
            setPartitions(prev => [...prev, newPartition]);
            setShowUpload(false);
            setUploadTitle('');
            setUploadAuthor('');
            setUploadInstrument('');
            setUploadFile(null);
        } catch {
            setUploadError(t('partitions_upload_error'));
        }
    }

    async function handleDelete(e, id) {
        e.stopPropagation();
        if (!window.confirm(t('partitions_confirm_delete'))) return;
        try {
            await deletePartition(id);
            setPartitions(prev => prev.filter(p => p.id !== id));
        } catch {
            // silent
        }
    }

    const isMini = filterMode !== 'none';

    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <div className="partitions__header">
                    <h1 className="page__title">{t('partitions_title')}</h1>
                    {isLoggedIn && canUpload && (
                        <button className="btn" onClick={() => setShowUpload(true)}>
                            {t('partitions_btn_add')}
                        </button>
                    )}
                </div>

                <div className="partitions__toolbar">
                    <input
                        className="partitions__search"
                        type="text"
                        placeholder={t('partitions_search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="partitions__filter">
                        <button
                            className={`partitions__filter__bubble${filterMode === 'author' ? ' partitions__filter__bubble--active' : ''}`}
                            onClick={() => toggleFilter('author')}
                        >
                            {t('partitions_filter_author')}
                        </button>
                        <button
                            className={`partitions__filter__bubble${filterMode === 'instrument' ? ' partitions__filter__bubble--active' : ''}`}
                            onClick={() => toggleFilter('instrument')}
                        >
                            {t('partitions_filter_instrument')}
                        </button>
                    </div>
                </div>

                <div className={`partitions__body${isMini ? ' partitions__body--split' : ''}`}>
                    {isMini && (
                        <nav className="partitions__index">
                            {groupIndex.map(group => (
                                <button
                                    key={group}
                                    className={`partitions__index__link${selectedGroup === group ? ' partitions__index__link--active' : ''}`}
                                    onClick={() => setSelectedGroup(selectedGroup === group ? null : group)}
                                >
                                    {group}
                                </button>
                            ))}
                        </nav>
                    )}

                    <div className={`grid partition__grid${isMini ? ' partition__grid--mini' : ''}`}>
                        {displayedPartitions.map(partition => (
                            <div
                                key={partition.id}
                                className={`card partition__card__tile${isMini ? ' partition__card__tile--mini' : ''}`}
                                onClick={() => setSelectedPdf(partition)}
                            >
                                {isAdmin && (
                                    <button
                                        className="partition__card__delete"
                                        onClick={(e) => handleDelete(e, partition.id)}
                                        title={t('partitions_btn_delete')}
                                    >×</button>
                                )}
                                <img src={logo_partition} alt={partition.title}/>
                                <p>{partition.title}</p>
                                {isMini && (
                                    <span className="partition__card__sub">
                                        {filterMode === 'author' ? partition.instrument : partition.author}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {selectedPdf && (
                    <div className="partition__modal" onClick={() => setSelectedPdf(null)}>
                        <div
                            className="partition__modal__content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>{selectedPdf.title}</h2>
                            {(selectedPdf.author || selectedPdf.instrument) && (
                                <p className="partition__modal__meta">
                                    {[selectedPdf.author, selectedPdf.instrument].filter(Boolean).join(' — ')}
                                </p>
                            )}
                            {selectedPdf.uploader_name && (
                                <p className="partition__modal__uploader">
                                    {t('partitions_uploaded_by')} {selectedPdf.uploader_name}
                                </p>
                            )}
                            <iframe src={selectedPdf.url} title="PDF preview"/>
                            <a
                                href={selectedPdf.url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn"
                            >
                                {t('partitions_fullscreen')}
                            </a>
                        </div>
                    </div>
                )}

                {showUpload && (
                    <div className="partition__modal" onClick={() => setShowUpload(false)}>
                        <div
                            className="partition__modal__content partition__upload__form"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>{t('partitions_upload_title')}</h2>
                            {uploadError && <p className="partition__upload__error">{uploadError}</p>}
                            <form onSubmit={handleUpload}>
                                <input
                                    type="text"
                                    placeholder={t('partitions_upload_placeholder_title')}
                                    value={uploadTitle}
                                    onChange={(e) => setUploadTitle(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder={t('partitions_upload_placeholder_author')}
                                    value={uploadAuthor}
                                    onChange={(e) => setUploadAuthor(e.target.value)}
                                />
                                <select
                                    value={uploadInstrument}
                                    onChange={(e) => setUploadInstrument(e.target.value)}
                                >
                                    <option value="">{t('partitions_upload_placeholder_instrument')}</option>
                                    {INSTRUMENTS.map(i => (
                                        <option key={i} value={i}>{i}</option>
                                    ))}
                                </select>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setUploadFile(e.target.files[0])}
                                    required
                                />
                                <div className="partition__upload__buttons">
                                    <button type="submit" className="btn">
                                        {t('partitions_upload_btn_submit')}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn--secondary"
                                        onClick={() => setShowUpload(false)}
                                    >
                                        {t('partitions_upload_btn_cancel')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <Footer/>
        </div>
    );
}

export default Partitions;
