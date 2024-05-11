import { ReactNode } from 'react';
import {
	Button,
	Dialog,
	DialogTrigger,
	Modal as AriaModal,
	ModalOverlay,
} from 'react-aria-components';
import { LuMaximize2, LuMinimize2 } from 'react-icons/lu';

interface ModalProps {
	children: ReactNode;
}
export const Modal = ({ children }: ModalProps) => {
	return (
		<DialogTrigger>
			<Button>
				<LuMaximize2 />
			</Button>
			<ModalOverlay
				className={({ isEntering, isExiting }) => `
          absolute flex h-screen w-screen items-center justify-center backdrop-blur-sm
          ${isEntering && 'duration-200 ease-out animate-in fade-in'}
          ${isExiting && 'duration-200 ease-in animate-out fade-out'}
        `}
			>
				<AriaModal
					className={({ isEntering, isExiting }) => `
			m-auto mx-2 aspect-video max-w-[50%] rounded-lg bg-dark p-2 ring-1 ring-white/20
            ${isEntering && 'duration-200 ease-out animate-in zoom-in-95'}
            ${isExiting && 'duration-200 ease-in animate-out zoom-out-95'}
          `}
					isDismissable
				>
					<Dialog className="size-full outline-none">
						{({ close }) => (
							<>
								<Button onPress={close} className="ml-auto block p-2">
									<LuMinimize2 />
								</Button>
								{children}
							</>
						)}
					</Dialog>
				</AriaModal>
			</ModalOverlay>
		</DialogTrigger>
	);
};
