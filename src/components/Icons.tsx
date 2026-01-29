import ArrowLeft from "../assets/arrow-left.svg?react"
import Bookmark from "../assets/bookmark.svg?react"
import Check from "../assets/check-lg.svg?react"
import CheckCircleFill from "../assets/check-circle-fill.svg?react"
import Copy from "../assets/copy.svg?react"
import ExclamationCircleFill from "../assets/exclamation-circle-fill.svg?react"
import ExclamationTriangle from "../assets/exclamation-triangle.svg?react"
import Eye from "../assets/eye.svg?react"
import EyeFill from "../assets/eye-fill.svg?react"
import EyeSlash from "../assets/eye-slash.svg?react"
import EyeSlashFill from "../assets/eye-slash-fill.svg?react"
import FilePlus from "../assets/file-plus.svg?react"
import FileUpload from "../assets/file-upload.svg?react"
import Gear from "../assets/gear.svg?react"
import Globe from "../assets/globe.svg?react"
import Home from "../assets/home.svg?react"
import Key from "../assets/key.svg?react"
import Lightbulb from "../assets/lightbulb.svg?react"
import LightbulbFill from "../assets/lightbulb-fill.svg?react"
import Lock from "../assets/lock.svg?react"
import InfoCircle from "../assets/info-circle.svg?react"
import InfoCircleFill from "../assets/info-circle-fill.svg?react"
import Person from "../assets/person.svg?react"
import Plus from "../assets/plus-lg.svg?react"
import Pencil from "../assets/pencil.svg?react"
import PencilFill from "../assets/pencil-fill.svg?react"
import Recent from "../assets/recent.svg?react"
import Search from "../assets/search.svg?react"
import ShieldLock from "../assets/shield-lock.svg?react"
import ShieldLockFill from "../assets/shield-lock-fill.svg?react"
import Star from "../assets/star.svg?react"
import Stars from "../assets/stars.svg?react"
import StarFill from "../assets/star-fill.svg?react"
import Trash from "../assets/trash.svg?react"
import TrashFill from "../assets/trash-fill.svg?react"
import Upload from "../assets/upload.svg?react"
import X from "../assets/x.svg?react"
import XCircleFill from "../assets/x-circle-fill.svg?react"
import { FunctionComponent, SVGProps } from "react"

export type SvgIconProps = SVGProps<SVGSVGElement> & {
  title?: string;
  titleId?: string;
  desc?: string;
  descId?: string;
};

export type SvgIcon = FunctionComponent<SvgIconProps>;
export type IconMap = Record<string, SvgIcon>;

const Icons = {
    ArrowLeft,
    Bookmark,
    Check,
    CheckCircleFill,
    Copy,
    ExclamationCircleFill,
    ExclamationTriangle,
    Eye,
    EyeFill,
    EyeSlash,
    EyeSlashFill,
    FilePlus,
    FileUpload,
    Gear,
    Globe,
    Home,
    Key,
    Lightbulb,
    LightbulbFill,
    Lock,
    InfoCircle,
    InfoCircleFill,
    Person,
    Plus,
    Pencil,
    PencilFill,
    Recent,
    Search,
    ShieldLock,
    ShieldLockFill,
    Star,
    Stars,
    StarFill,
    Trash,
    TrashFill,
    Upload,
    X,
    XCircleFill,
} satisfies Record<string, SvgIcon>

export default Icons;