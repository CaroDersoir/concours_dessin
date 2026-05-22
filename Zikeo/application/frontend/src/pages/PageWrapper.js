import { useContext } from "react";
import { PreferencesContext } from "../context/indexContext";

function PageWrapper({ children }) {

    const { mode } = useContext(PreferencesContext);

    return (
        <div className={`${mode}__mode`}>
            {children}
        </div>
    );
}

export default PageWrapper;