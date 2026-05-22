import {useHistory, useLocation, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {getItemById} from '../service/itemsServiceFront';

function ItemDetail() {
    const {idArticle} = useParams();
    const location = useLocation();
    const history = useHistory();
    const [itemDetail, setItemDetail] = useState(location.state?.item ?? {});

    useEffect(() => {
        if (location.state?.item) {
            setItemDetail(location.state.item);
            return;
        }

        if (!idArticle) return;

        getItemById(idArticle)
            .then(setItemDetail)
            .catch((error) => console.error('Erreur récupération du détail vêtement :', error));
    }, [idArticle, location.state]);

    return (
        <div>
            <h1>Détails du produit</h1>
            <p>Voici les détails du produit sélectionné.</p>
            <p>ID de l'article : {idArticle}</p>
            <p>{itemDetail.name ?? '-'}</p>
            <p>Prix : {itemDetail.price ?? '-'} euros</p>
            <p>Confort : {itemDetail.comfort ?? '-'}</p>
            <p>Taille : {itemDetail.size ?? '-'}</p>
            <p>Genre : {itemDetail.gender ?? '-'}</p>
            <p>Catégorie : {itemDetail.category ?? '-'}</p>
            <p>Stock : {itemDetail.stock ?? '-'}</p>
            <p>En promotion
                : {itemDetail.onSale === true || Number(itemDetail.onSale) === 1 || Number(itemDetail.on_sale) === 1 ? 'Oui' : 'Non'}</p>
            <p>Description : {itemDetail.description ?? '-'}</p>
            {itemDetail.covers?.length > 0 ? (
                itemDetail.covers.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`${itemDetail.name ?? 'Article'} ${index + 1}`}
                        style={{maxWidth: '220px', height: 'auto'}}
                    />
                ))
            ) : (
                <p>Pas d'image</p>
            )}

            <button onClick={() => history.goBack()}>Fermer</button>
        </div>
    );
}

export default ItemDetail;
