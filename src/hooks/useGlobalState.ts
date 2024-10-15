import {useContext} from 'react';

import { GlobalContext } from '@/anchor/global';

export const useGlobalState = () => {
    return useContext(GlobalContext);
}