import React from 'react'
import { AnimatePresence , motion } from 'framer-motion';
import { useRecoilState } from 'recoil';
import { messageModalAlertState } from '../../../WhiteBoardStateManagement/Atom';

function ModalAlert() {
    const [ messageModalAlert , setMessageModalAlert ] = useRecoilState(messageModalAlertState);
    return(
        <AnimatePresence>
            {messageModalAlert !== '-' &&
            <motion.div className="h-screen w-full fixed top-0 left-0  flex justify-center items-center z-50 bg-blue-dark-op50 "
                animate={{ opacity: 1 }}
                initial={{opacity : 0  }}
                exit = {{ opacity : 0 }}
                transition={{  duration: 1 }}
            >{messageModalAlert !== '-' &&
                <motion.div className="flex flex-col justify-center items-center w-full max-w-xl bg-white rounded-lg relative pt-6 pb-4 gap-6"
                            animate={{ opacity: 1 , y: 0 ,rotateX:0}}
                            initial={{opacity : 0 , y:-150 , rotateX:90}}
                            exit ={{ opacity : 0 ,scale:0 , rotateX:90}}
                            transition={{  duration: 0.7 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z" />
                    </svg>
                    <p className="text-gray text-[20px]">{messageModalAlert}</p>
                    <button className="flex w-[100px] py-2 justify-center items-center text-[20px] text-white bg-primary-blue-1 active:bg-blue-dark ease-linear duration-100 rounded-lg "
                        onClick={()=>{
                            setMessageModalAlert('-');
                        }}
                    >
                        Close
                    </button>
                </motion.div>}
            </motion.div>}
        </AnimatePresence>
    );
}

export default ModalAlert