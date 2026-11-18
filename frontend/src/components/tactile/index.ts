/**
 * Design system tactile / neumorphique.
 *
 * Tokens : `NEU_TOKENS` + classes CSS `neu-*` (`styles/neu-tokens.css`).
 * Alias kit : `./aliases` (Potentiometer, Button, Input…).
 */

export { NEU_TOKENS, TACTILE, SURFACES, ACCENT_GLOW, neuSize } from './tokens'
export type { SurfaceDepth, NeuSize, TactileSize } from './tokens'

export {
  Potentiometer,
  VUMeter,
  UvMeter,
  AudioLevelIndicator,
  Button,
  Input,
  Password,
  Search,
  Checkbox,
  Radio,
  Toggle,
  Range,
  Segmented,
  Select,
  Combobox,
  Upload,
  Form,
  Tab,
  Navigation,
  Tabnav,
  Breadcrumb,
  Sidemenu,
  Skiplink,
  Summary,
  Header,
  Translate,
  Notice,
  Highlight,
  Modal,
  Consent,
  Quote,
  Content,
  Table,
  Transcription,
  Logo,
  Display,
  Download,
  Dropdown,
  Follow,
  Link,
  Share,
  Footer,
} from './aliases'
export type {
  PotentiometerProps,
  AudioLevelIndicatorProps,
  ButtonProps,
  InputProps,
  PasswordProps,
  SearchProps,
  CheckboxProps,
  RadioProps,
  ToggleProps,
  RangeProps,
  SegmentedProps,
  SelectProps,
  ComboboxProps,
  UploadProps,
  FormProps,
  TabProps,
  NavItem,
} from './aliases'

export { useDismissible } from './lib/useDismissible'
export { polarToCartesian, describeArc, describeSector } from './lib/geometry'
export { spectrumColor } from './lib/spectrum'
export {
  angleToRatio,
  BallisticsProcessor,
  ratioToAngle,
  rmsToDbfs,
  VU_MAX_ANGLE,
  VU_MIN_ANGLE,
  VU_SWEEP,
  vuDbToAngle,
} from './lib/vuBallistics'

export { Panel, IconAction, SegmentedPills, MenuSurface, MenuItem, MenuLabel, MenuSeparator } from './primitives'
export type {
  PanelProps,
  IconActionProps,
  IconActionSize,
  IconActionTone,
  SegmentedPillsProps,
  SegmentedPillsOption,
  MenuSurfaceProps,
  MenuItemProps,
  MenuAlign,
} from './primitives'

export { useFieldMeta, FieldLabel, FieldFeedback, fieldSurface } from './forms/Field'
export type { FieldMeta } from './forms/Field'
export { PillButton } from './forms/PillButton'
export type { PillButtonProps, PillButtonSize, PillButtonVariant } from './forms/PillButton'
export { CtaButton, CTA_ICON_CLASS } from './forms/CtaButton'
export type { CtaButtonProps, CtaSize, CtaTone } from './forms/CtaButton'
export { TextField, PasswordField, SearchField } from './forms/TextField'
export type { TextFieldProps, PasswordFieldProps, SearchFieldProps } from './forms/TextField'
export { CheckboxField, RadioGroup, ToggleSwitch } from './forms/Choice'
export type { CheckboxFieldProps, RadioGroupProps, RadioOption, ToggleSwitchProps } from './forms/Choice'
export { RangeField } from './forms/RangeField'
export type { RangeFieldProps } from './forms/RangeField'
export { SelectField, ComboboxField, LanguageMenu } from './forms/SelectField'
export type {
  SelectFieldProps,
  SelectOption,
  ComboboxFieldProps,
  ComboboxOption,
  LanguageMenuProps,
  LanguageOption,
} from './forms/SelectField'
export { FileDropzone, DownloadCard } from './forms/FileDropzone'
export type { FileDropzoneProps, DroppedFile, DownloadCardProps } from './forms/FileDropzone'
export { ContactForm } from './forms/ContactForm'
export type { ContactFormProps, ContactFormValues } from './forms/ContactForm'

export {
  SpectrumKnob,
  VuMeter,
  AudioLevelMeter,
  useAudioSimulator,
  TransportDeck,
  formatTimecode,
  Power,
  JogWheel,
  AudioGrid,
  ChannelFader,
  Crossfader,
  crossfadeGains,
  WaveformDisplay,
  demoPeaks,
  formatWaveTime,
  StepSequencer,
  SEQUENCER_PRESETS,
  emptyPattern,
  SpectrumAnalyzer,
  DEFAULT_EQ_BANDS,
  RTA_FREQUENCIES,
  PianoKeyboard,
  Oscilloscope,
  TempoTap,
  bpmFromTaps,
  MonitorController,
  DEFAULT_MONITOR_STATE,
  AdsrEnvelope,
  ADSR_PRESETS,
  XYPad,
  PatchMatrix,
  EMPTY_PATCH,
  DEFAULT_PATCH_PRESETS,
} from './audio'
export type {
  SpectrumKnobProps,
  SpectrumKnobSize,
  VuMeterProps,
  VuMeterOptions,
  AudioLevelMeterProps,
  LevelMeterMode,
  LevelMeterVariant,
  AudioSimulatorState,
  TransportDeckProps,
  PowerProps,
  JogWheelProps,
  AudioGridProps,
  AudioGridMode,
  AudioGridVariant,
  AudioGridPattern,
  ChannelFaderProps,
  CrossfaderProps,
  CrossfaderCurve,
  WaveformDisplayProps,
  LoopRegion,
  WaveformRate,
  StepSequencerProps,
  SequencerPattern,
  SequencerPreset,
  SpectrumAnalyzerProps,
  EqBand,
  PianoKeyboardProps,
  OscilloscopeProps,
  ScopeMode,
  ScopeWaveform,
  TempoTapProps,
  TimeSignature,
  MonitorControllerProps,
  MonitorState,
  MonitorSource,
  MonitorBus,
  AdsrEnvelopeProps,
  AdsrValues,
  AdsrPresetName,
  XYPadProps,
  XYValue,
  PatchMatrixProps,
  PatchGrid,
  PatchPreset,
} from './audio'

export {
  BottomDock,
  NotchBar,
  AppHeader,
  HeaderUser,
  Window,
} from './shell'
export type {
  BottomDockProps,
  DockItem,
  DockEntry,
  NotchBarProps,
  NotchTab,
  AppHeaderProps,
  HeaderUserProps,
  WindowProps,
} from './shell'

export { TabBar, Breadcrumbs, Pagination, Stepper, SideNavigation, SkipLinks, PageOutline } from './navigation'
export type {
  TabBarProps,
  TabItem,
  BreadcrumbsProps,
  BreadcrumbItem,
  PaginationProps,
  StepperProps,
  Step,
  SideNavigationProps,
  SideNavigationSection,
  SideNavigationItem,
  SkipLinksProps,
  SkipLink,
  PageOutlineProps,
  PageOutlineItem,
} from './navigation'

export {
  Accordion,
  Alert,
  NoticeBanner,
  Badge,
  Tag,
  Callout,
  StatHighlight,
  Tooltip,
  ConfirmDialog,
  ConsentBanner,
} from './feedback'
export type {
  AccordionProps,
  AccordionItem,
  AlertProps,
  AlertVariant,
  NoticeBannerProps,
  BadgeProps,
  BadgeVariant,
  TagProps,
  CalloutProps,
  StatHighlightProps,
  TooltipProps,
  TooltipPosition,
  ConfirmDialogProps,
  ConsentBannerProps,
} from './feedback'

export { Card, Tile, QuoteBlock, MediaPlayer, DataTable, Transcript, BrandLogo } from './content'
export type {
  CardProps,
  CardVariant,
  TileProps,
  QuoteBlockProps,
  MediaPlayerProps,
  DataTableProps,
  DataColumn,
  TranscriptProps,
  TranscriptSegment,
  BrandLogoProps,
} from './content'

export {
  DisplaySettings,
  ActionMenu,
  NewsletterSignup,
  TextLink,
  ShareMenu,
  SiteFooter,
} from './actions'
export type {
  DisplaySettingsProps,
  FontScale,
  ContrastMode,
  ActionMenuProps,
  ActionMenuItem,
  NewsletterSignupProps,
  TextLinkProps,
  ShareMenuProps,
  SiteFooterProps,
  FooterColumn,
} from './actions'
