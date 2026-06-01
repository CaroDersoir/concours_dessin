import {useContext} from "react";
import {OptionContext} from "../context/indexContext";

function PageWrapper({children}) {

    const {mode} = useContext(OptionContext);

    return (
        <div className={`${mode}__mode`}>
            {children}
        </div>
    );
}

export default PageWrapper;