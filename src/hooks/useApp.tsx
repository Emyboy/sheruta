import { useState } from 'react';
import { useToast } from '@chakra-ui/react';

interface CommonState {
    loading: boolean;
}

const initialCommonState: CommonState = {
    loading: false,
};

const useCommon = () => {
    const [state, setState] = useState<CommonState>(initialCommonState);
    const toast = useToast();

    const showToast = ({ message, status = 'success' }: { message: string, status: 'success' | 'error' | 'warning' | 'info' }) => {
        toast({
            title: message,
            status: status,
            duration: 3000,
            isClosable: true,
        });
    };

    const setCommonState = (newState: Partial<CommonState>) => {
        setState(prevState => ({
            ...prevState,
            ...newState,
        }));
    };

    return {
        CommonState: state,
        setCommonState,
        showToast,
    };
};

export default useCommon;
