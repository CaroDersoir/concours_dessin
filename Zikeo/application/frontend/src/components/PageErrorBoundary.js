// Isole les erreurs de rendu d'une page pour éviter de faire planter toute l'application
import React from 'react';

class PageErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    componentDidCatch(error, info) {
        console.error('[PageErrorBoundary]', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{padding: '2rem', textAlign: 'center'}}>
                    <h2>Cette page a rencontré une erreur.</h2>
                    <p>Les autres pages continuent de fonctionner normalement.</p>
                    <button
                        className="btn"
                        onClick={() => this.setState({hasError: false})}
                        style={{marginTop: '1rem'}}
                    >
                        Réessayer
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default PageErrorBoundary;
