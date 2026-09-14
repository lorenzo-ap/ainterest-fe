import type { IconWeight, Icon as PhosphorIcon } from '@phosphor-icons/react';
// per-icon entry points: importing from the package root pulls in the whole set
import { ArrowClockwise } from '@phosphor-icons/react/dist/csr/ArrowClockwise';
import { ArrowsDownUp } from '@phosphor-icons/react/dist/csr/ArrowsDownUp';
import { ArrowUp } from '@phosphor-icons/react/dist/csr/ArrowUp';
import { Bell } from '@phosphor-icons/react/dist/csr/Bell';
import { CaretLeft } from '@phosphor-icons/react/dist/csr/CaretLeft';
import { CaretRight } from '@phosphor-icons/react/dist/csr/CaretRight';
import { Check } from '@phosphor-icons/react/dist/csr/Check';
import { Checks } from '@phosphor-icons/react/dist/csr/Checks';
import { Copy } from '@phosphor-icons/react/dist/csr/Copy';
import { CornersOut } from '@phosphor-icons/react/dist/csr/CornersOut';
import { DownloadSimple } from '@phosphor-icons/react/dist/csr/DownloadSimple';
import { Eye } from '@phosphor-icons/react/dist/csr/Eye';
import { EyeSlash } from '@phosphor-icons/react/dist/csr/EyeSlash';
import { Heart } from '@phosphor-icons/react/dist/csr/Heart';
import { Key } from '@phosphor-icons/react/dist/csr/Key';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { Moon } from '@phosphor-icons/react/dist/csr/Moon';
import { Plus } from '@phosphor-icons/react/dist/csr/Plus';
import { Question } from '@phosphor-icons/react/dist/csr/Question';
import { ShareNetwork } from '@phosphor-icons/react/dist/csr/ShareNetwork';
import { Shuffle } from '@phosphor-icons/react/dist/csr/Shuffle';
import { SignOut } from '@phosphor-icons/react/dist/csr/SignOut';
import { SquaresFour } from '@phosphor-icons/react/dist/csr/SquaresFour';
import { Sun } from '@phosphor-icons/react/dist/csr/Sun';
import { Trash } from '@phosphor-icons/react/dist/csr/Trash';
import { User } from '@phosphor-icons/react/dist/csr/User';
import { X } from '@phosphor-icons/react/dist/csr/X';

/**
 * The product's icon vocabulary.
 *
 * Phosphor at regular weight sits on the same hairline as the rest of the
 * interface. Everything is mapped here — semantic name in, glyph out — so the
 * set stays small, consistent, and swappable from a single file.
 */

type IconProps = {
	size?: number;
	className?: string;
	weight?: IconWeight;
};

const icon =
	(Glyph: PhosphorIcon, defaultWeight: IconWeight = 'regular') =>
	({ size = 18, className, weight }: IconProps) => (
		<Glyph className={className} size={size} weight={weight ?? defaultWeight} />
	);

export const SearchIcon = icon(MagnifyingGlass);
export const CloseIcon = icon(X);
export const ChevronLeftIcon = icon(CaretLeft);
export const ChevronRightIcon = icon(CaretRight);
export const ArrowUpIcon = icon(ArrowUp);
export const HeartIcon = icon(Heart);
export const HeartFilledIcon = icon(Heart, 'fill');
export const BellIcon = icon(Bell);
export const TrashIcon = icon(Trash);
export const CheckIcon = icon(Check);
export const CheckAllIcon = icon(Checks);
export const SortIcon = icon(ArrowsDownUp);
export const RefreshIcon = icon(ArrowClockwise);
export const DownloadIcon = icon(DownloadSimple);
export const ShareIcon = icon(ShareNetwork);
export const CopyIcon = icon(Copy);
export const ShuffleIcon = icon(Shuffle);
export const ExpandIcon = icon(CornersOut);
export const GridIcon = icon(SquaresFour);
export const UserIcon = icon(User);
export const PlusIcon = icon(Plus);
export const EyeIcon = icon(Eye);
export const EyeOffIcon = icon(EyeSlash);
export const KeyIcon = icon(Key);
export const HelpIcon = icon(Question);
export const SignOutIcon = icon(SignOut);
export const SunIcon = icon(Sun);
export const MoonIcon = icon(Moon);
