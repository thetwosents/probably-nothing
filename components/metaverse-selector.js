import React, { useState, useEffect } from 'react';
import {
    initialState
} from '../data/thetwosents/metaverse-selector'
import Typeahead from './type-ahead';

export default function MetaverseSelector() {
    const [state2, setState2] = useState(null);

    useEffect(() => {
        setState2(initialState);
    }, []);
    const [selected, setSelected] = useState(null);

    if (!state2) {
        return null;
    }
    return (
        <>
            <Typeahead
                data_global={state2.metaverses} />
        </>
    )
}