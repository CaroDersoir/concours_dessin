// Promo modal component (copied from Promotions.js)
import {useEffect, useState} from "react";
import {createPromotion, updatePromotion} from "../service/promotionServiceFront";

function PromotionEdit({isOpen, promo, onClose, onSaved, t}) {
    const emptyPromo = {
        name: '',
        code: '',
        description: '',
        discount_percent: '',
        start_date: '',
        end_date: '',
        conditions: '',
        type: 'item'
    };

    const [formData, setFormData] = useState(emptyPromo);
    const [error, setError] = useState('');

    const isCreating = !promo;

    useEffect(() => {
        if (!isOpen) return;
        setFormData(promo ? {
            name: promo.name || '',
            code: promo.code || '',
            description: promo.description || '',
            discount_percent: promo.discount_percent ?? '',
            start_date: promo.start_date || '',
            end_date: promo.end_date || '',
            conditions: promo.conditions || '',
            type: promo.type || 'item'
        } : emptyPromo);
        setError('');
    }, [promo, isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    function set(field) {
        return (e) => setFormData({...formData, [field]: e.target.value});
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const payload = {
            ...formData,
            discount_percent: Number(formData.discount_percent),
            code: formData.code || null
        };

        if (payload.type === 'code' && !formData.code) {
            setError(t('promo_modal_error_code_required'));
            return;
        }

        try {
            if (isCreating) {
                await createPromotion(payload);
            } else {
                await updatePromotion(promo.id, payload);
            }
            onSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    }

    return (
        <div className="promo-modal__overlay" onClick={onClose}>
            <div className="promo-modal__content" onClick={(e) => e.stopPropagation()}>
                <div className="promo-modal__header">
                    <h2 className="promo-modal__title">
                        {isCreating ? t('promo_modal_title_add') : t('promo_modal_title_edit')}
                    </h2>
                    <button type="button" className="btn btn--ghost" onClick={onClose}>{t('item_btn_close')}</button>
                </div>

                {error && <p className="promo-modal__feedback">{error}</p>}

                <form className="promo-modal__form" onSubmit={handleSubmit}>
                    <input className="input" placeholder={t('promo_modal_placeholder_name')} value={formData.name}
                           onChange={set('name')} required/>
                    <select className="input" value={formData.type} onChange={set('type')}>
                        <option value="item">{t('promo_modal_type_item')}</option>
                        <option value="code">{t('promo_modal_type_code')}</option>
                    </select>
                    <div className="promo-modal__row">
                        <input className="input promo-modal__code-input" placeholder={t('promo_modal_placeholder_code')}
                               value={formData.code}
                               onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                               required={formData.type === 'code'}/>
                        <input className="input" type="number" min="1" max="100" step="0.01"
                               placeholder={t('promo_modal_placeholder_discount')} value={formData.discount_percent}
                               onChange={set('discount_percent')} required/>
                    </div>
                    <div className="promo-modal__row">
                        <label className="input promo-modal__date-label">
                            {t('promo_modal_label_start')}
                            <input type="date" value={formData.start_date} onChange={set('start_date')} required/>
                        </label>
                        <label className="input promo-modal__date-label">
                            {t('promo_modal_label_end')}
                            <input type="date" value={formData.end_date} onChange={set('end_date')} required/>
                        </label>
                    </div>
                    <textarea className="input" placeholder={t('item_edit_placeholder_desc')}
                              value={formData.description}
                              onChange={set('description')} rows={2}/>
                    <textarea className="input" placeholder={t('promo_modal_placeholder_conditions')}
                              value={formData.conditions}
                              onChange={set('conditions')} rows={2}/>
                    <div className="promo-modal__actions">
                        <button className="btn" type="submit">
                            {isCreating ? t('promo_modal_btn_create') : t('item_edit_btn_save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PromotionEdit;