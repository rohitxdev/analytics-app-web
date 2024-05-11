import { ComponentProps } from 'react';

interface ImageProps extends ComponentProps<'img'> {
	fallbackSrc?: string;
}
export const Image = ({ alt, src, fallbackSrc, className, onError, ...rest }: ImageProps) => {
	return (
		<img
			alt={alt}
			src={src}
			onError={(e) => {
				if (fallbackSrc) {
					e.currentTarget.src = fallbackSrc;
				}
				if (onError) {
					onError(e);
				}
			}}
			style={{ backgroundImage: `url(${fallbackSrc})` }}
			className={`bg-contain bg-center bg-no-repeat ${className}`}
			{...rest}
		/>
	);
};
