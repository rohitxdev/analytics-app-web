import { ReactNode } from 'react';
import { Dialog, DialogTrigger, Modal as AriaModal, ModalOverlay } from 'react-aria-components';

interface ModalProps {
	children: ReactNode;
	isOpen: boolean;
}
export const Modal = ({ children, isOpen }: ModalProps) => {
	return (
		<DialogTrigger isOpen={isOpen}>
			<ModalOverlay
				className={({ isEntering, isExiting }) => `
          fixed top-0 flex h-screen w-screen items-center justify-center bg-dark/60 backdrop-blur-sm
          ${isEntering && 'duration-200 ease-out animate-in fade-in'}
          ${isExiting && 'duration-200 ease-in animate-out fade-out'}
        `}
			>
				<AriaModal
					className={({ isEntering, isExiting }) => `rounded-lg bg-dark ring-1 ring-white/20
            ${isEntering && 'duration-200 ease-out animate-in zoom-in-95'}
            ${isExiting && 'duration-200 ease-in animate-out zoom-out-95'}
          `}
					isDismissable
				>
					<Dialog className="size-full outline-none">{children}</Dialog>
				</AriaModal>
			</ModalOverlay>
			{children}
		</DialogTrigger>
	);
};
